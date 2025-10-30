import prisma from "../dataAccess/prisma/prisma";
import { Prisma } from "./../dataAccess/prisma/generated/client";
import { Unit } from "@shared/types/models";
import { Collect } from "@shared/types/others";

export class UnitBL {
    // Create a new Collect object with default values
    public static newCollect(): Collect {
        return {
            wood: 0,
            wine: 0,
            marble: 0,
            glass: 0,
            sulfur: 0,
            population: 0,
            time: 0,
        };
    }

    // Add unit cost to a Collect object
    public static addCollect(collect: Collect, unit: Unit, cant: number): void {
        collect.wood += unit.wood * cant;
        collect.wine += unit.wine * cant;
        collect.glass += unit.glass * cant;
        collect.sulfur += unit.sulfur * cant;
        collect.population += unit.population * cant;
        collect.time += unit.time * cant;
    }

    // Process all regiment tails for the current user
    public static async allConstructTails(userId: number): Promise<void> {
        const regiments = await prisma.regiment.findMany({
            where: { userId },
            select: { id: true },
        });

        const tails = await prisma.regimentTail.findMany({
            where: {
                regimentId: { in: regiments.map(r => r.id) },
                constructedAt: { lt: new Date() },
            },
            include: { regiment: true },
        });

        if (tails.length > 0) {
            await this.notifyTails(tails, userId);
        }

        for (const tail of tails) {
            await this.endTail(tail);
        }
    }

    // Check regiment construction time
    public static async checkConstructedTime(regimentId: number, userId: number): Promise<void> {
        const tails = await prisma.regimentTail.findMany({
            where: {
                regimentId,
                constructedAt: { lt: new Date() },
            },
            include: { regiment: true },
        });

        if (tails.length > 0) {
            await this.notifyTails(tails, userId);
        }

        for (const tail of tails) {
            await this.endTail(tail);
        }
    }

    // Notify user about finished regiment tails
    private static async notifyTails(tails: (Prisma.RegimentTailGetPayload<{ include: { regiment: true } }>)[], userId: number): Promise<void> {
        const data: { cityId: number; units: { unitId: number; cant: number }[] }[] = [];
        const aux: number[] = [];

        for (const tail of tails) {
            const cityId = tail.regiment.cityId;
            let index = aux.indexOf(cityId);

            if (index === -1) {
                index = aux.length;
                aux.push(cityId);
                data[index] = { cityId, units: [] };
            }

            data[index].units.push({ unitId: tail.unitId, cant: tail.cant });
        }

        // Insert mayor notifications
        for (const value of data) {
            await prisma.mayor.create({
                data: {
                    cityId: value.cityId,
                    type: 5,
                    readed: 0,
                    data: JSON.stringify(value.units),
                },
            });
        }

        // Dispatch event (replace with your event system)
        // event(new UserNotification('advisors','mayor', userId));
    }

    // End regiment tail (add units or update count)
    private static async endTail(tail: Prisma.RegimentTailGetPayload<{ include: { regiment: true } }>): Promise<void> {
        const regimentUnit = await prisma.regimentUnit.findFirst({
            where: { regimentId: tail.regimentId, unitId: tail.unitId },
        });

        if (!regimentUnit) {
            await prisma.regimentUnit.create({
                data: {
                    regimentId: tail.regimentId,
                    unitId: tail.unitId,
                    cant: tail.cant,
                },
            });
        } else {
            await prisma.regimentUnit.update({
                where: { id: regimentUnit.id },
                data: { cant: regimentUnit.cant + tail.cant },
            });
        }

        await prisma.regimentTail.delete({ where: { id: tail.id } });
    }

    // Check if barrack level is enough for a unit
    public static async checkBarrackLevel(cityId: number, unit: Unit): Promise<boolean> {
        const cityBuildings = await prisma.cityBuilding.findMany({
            where: { cityId },
            include: { buildingLevel: true },
        });

        return cityBuildings.some(cb =>
            cb.buildingLevel.buildingId === 4 && cb.buildingLevel.level >= unit.barrackLevel
        );
    }

    // Check if user has required research for a unit
    public static async checkResearch(unitId: number, userId: number): Promise<boolean> {
        const researchUnit = await prisma.researchUnit.findFirst({
            where: { unitId },
        });

        if (researchUnit) {
            const exists = await prisma.userResearch.findFirst({
                where: { userId, researchId: researchUnit.researchId },
            });

            return !!exists;
        }

        return true;
    }

    // Remove units if gold consumption is greater than production
    public static async removeUnitFromGoldConsume(unitsConsume: number, goldProduction: number, userId: number): Promise<void> {
        const regiments = await prisma.regiment.findMany({
            where: { userId },
            include: { regimentsUnits: { include: { unit: true } } },
        });

        for (const regiment of regiments) {
            for (const regimentUnit of regiment.regimentsUnits) {
                if (unitsConsume > goldProduction) {
                    unitsConsume -= regimentUnit.cant * regimentUnit.unit.gold;

                    await prisma.regimentUnit.delete({
                        where: { id: regimentUnit.id },
                    });
                }
            }
        }
    }

    public static async getData(userId: number, cityId: number) {
        await UnitBL.allConstructTails(userId);

        const regiments = await prisma.regiment.findMany({
            where: { userId, cityId },
            include: {
                regimentTails: true,
                regimentsUnits: { include: { unit: true } },
            },
        });

        const allTails: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            constructedAt: Date | null;
            regimentId: number;
            unitId: number;
            cant: number;
            tail: number;
        }[] = [];
        const allUnits: {
            cant: number;
            unit_id: number;
            size: number;
        }[] = [];

        for (const r of regiments) {
            allTails.push(...r.regimentTails);
            allUnits.push(
                ...r.regimentsUnits.map((u) => ({
                    cant: u.cant,
                    unit_id: u.unitId,
                    size: u.unit.size,
                }))
            );
        }

        return { tails: allTails, units: allUnits };
    }
}