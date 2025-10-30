import prisma from "../dataAccess/prisma/prisma";
import { Prisma } from "./../dataAccess/prisma/generated/client";
import { CityBL } from './cityBL';
import { UnitBL } from './unitBL';
import { WareHouseBL } from './wareHouseBL';
import { MovementBL } from "./movementBL";
import dayjs from 'dayjs';
import { world } from "../config";
import { UserResourceBL } from "./userResourceBL";
import { addSeconds } from "date-fns";

type UnitBest = Prisma.RegimentUnitGetPayload<{ include: { unit: true } }> & { value: number, power: number };

export class CombatBL {

    private static async getBestAttackValue(units: Prisma.RegimentUnitGetPayload<{ include: { unit: true } }>[], type: number): Promise<{ power: number, unit: UnitBest | undefined }> {
        const filtered = units
            .filter(u => u.unit.attackType === type)
            .map(u => {
                return {
                    ...u,
                    power: u.unit.attack * u.cant,
                    value: u.unit.attack
                }
            });

        if (!filtered.length) return { power: 0, unit: undefined };

        const maxPower = Math.max(...filtered.map(u => u.power));
        const bestUnit = filtered.find(u => u.power === maxPower);
        return { power: maxPower, unit: bestUnit };
    }

    private static async getBestDefenseValue(units: Prisma.RegimentUnitGetPayload<{ include: { unit: true } }>[], type: number): Promise<{ power: number, unit: UnitBest | undefined }> {
        const mapped: UnitBest[] = units.map(u => {
            let value = 0, power = 0;
            switch (type) {
                case 1: value = u.unit.defenseBlunt; power = value * u.cant; break;
                case 2: value = u.unit.defenseSharp; power = value * u.cant; break;
                case 3: value = u.unit.defenseDistance; power = value * u.cant; break;
            }
            return { ...u, value, power };
        });

        if (!mapped.length) return { power: 0, unit: undefined };

        const maxPower = Math.max(...mapped.map(u => u.power));
        const bestUnit = mapped.find(u => u.power === maxPower);
        return { power: maxPower, unit: bestUnit };
    }

    private static async round(
        regimentAttackIds: number[],
        regimentDefenseIds: number[],
        combatReportId: number,
        roundNumber: number,
        defenseBonus: number
    ) {
        let unitsAttack = await prisma.regimentUnit.findMany({ where: { regimentId: { in: regimentAttackIds } }, include: { unit: true } });
        let unitsDefense = await prisma.regimentUnit.findMany({ where: { regimentId: { in: regimentDefenseIds } }, include: { unit: true } });

        if (!unitsAttack.length || !unitsDefense.length) return;

        for (let type = 1; type <= 3; type++) {
            const attackData = await this.getBestAttackValue(unitsAttack, type);
            const defenseData = await this.getBestDefenseValue(unitsDefense, type);

            if (attackData.unit && defenseData.unit) {
                roundNumber++;
                defenseData.power *= defenseBonus;

                if (defenseData.power >= attackData.power) {
                    // Defender wins
                    const survivors = Math.ceil((defenseData.power - attackData.power) / defenseData.unit.value);
                    await prisma.regimentUnit.update({ where: { id: attackData.unit.id }, data: { deletedAt: new Date() } });
                    await prisma.regimentUnit.update({ where: { id: defenseData.unit.id }, data: { cant: survivors } });

                    await prisma.combatReportDetail.create({
                        data: {
                            combatReportId,
                            round: roundNumber,
                            typeAttack: type,
                            result: 2,
                            attackUnitId: attackData.unit.unitId,
                            attackBeforeCant: attackData.unit.cant,
                            attackAfterCant: 0,
                            defenseUnitId: defenseData.unit.unitId,
                            defenseBeforeCant: defenseData.unit.cant,
                            defenseAfterCant: survivors
                        }
                    });
                } else {
                    // Attacker wins
                    const survivors = Math.ceil((attackData.power - defenseData.power) / attackData.unit.value);
                    await prisma.regimentUnit.update({ where: { id: defenseData.unit.id }, data: { deletedAt: new Date() } });
                    await prisma.regimentUnit.update({ where: { id: attackData.unit.id }, data: { cant: survivors } });

                    await prisma.combatReportDetail.create({
                        data: {
                            combatReportId,
                            round: roundNumber,
                            typeAttack: type,
                            result: 1,
                            attackUnitId: attackData.unit.unitId,
                            attackBeforeCant: attackData.unit.cant,
                            attackAfterCant: survivors,
                            defenseUnitId: defenseData.unit.unitId,
                            defenseBeforeCant: defenseData.unit.cant,
                            defenseAfterCant: 0
                        }
                    });
                }

                // Refresh units
                unitsAttack = await prisma.regimentUnit.findMany({ where: { regimentId: { in: regimentAttackIds } }, include: { unit: true } });
                unitsDefense = await prisma.regimentUnit.findMany({ where: { regimentId: { in: regimentDefenseIds } }, include: { unit: true } });
            }
        }

        // Continue combat if both sides have units
        if (unitsAttack.length && unitsDefense.length) {
            await this.round(regimentAttackIds, regimentDefenseIds, combatReportId, roundNumber, defenseBonus);
        }
    }

    public static async checkAttack(movementRegimentId: number, cityToId: number) {
        const regimentAttack = await prisma.regiment.findMany({ where: { id: movementRegimentId }, select: { id: true } });
        const regimentDefense = await prisma.regiment.findMany({ where: { cityId: cityToId }, select: { id: true } });

        const combatReport = await prisma.combatReport.create({ data: { movementRegimentId, result: 0 } });
        let roundNumber = 0;

        const cityWall = await prisma.cityBuilding.findFirst({
            where: { cityId: cityToId, buildingLevel: { buildingId: 19 } },
            include: { buildingLevel: true }
        });

        const wallLevel = cityWall ? cityWall.buildingLevel.level : 0;
        const defenseBonus = 1 + wallLevel * 0.05; // reemplaza con config real

        await this.round(regimentAttack.map(r => r.id), regimentDefense.map(r => r.id), combatReport.id, roundNumber, defenseBonus);

        const resultReport = await prisma.combatReport.findUnique({ where: { id: combatReport.id } });
        return resultReport?.result ?? null;
    }

    public static async getResourceSteal(cityId: number, size: number) {
        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) return null;

        await CityBL.updateResources(cityId);

        const protectedCapacity = await WareHouseBL.checkProtected(cityId);
        const totalCapacity = protectedCapacity + 100; // resource_protected_base

        const collect = UnitBL.newCollect();
        collect.wood = city.wood > totalCapacity ? city.wood - totalCapacity : 0;
        collect.wine = city.wine > totalCapacity ? city.wine - totalCapacity : 0;
        collect.marble = city.marble > totalCapacity ? city.marble - totalCapacity : 0;
        collect.glass = city.glass > totalCapacity ? city.glass - totalCapacity : 0;
        collect.sulfur = city.sulfur > totalCapacity ? city.sulfur - totalCapacity : 0;

        const totalResources = collect.wood + collect.wine + collect.marble + collect.glass + collect.sulfur;
        if (size >= totalResources) return collect;

        const per = size / totalResources;
        collect.wood *= per;
        collect.wine *= per;
        collect.marble *= per;
        collect.glass *= per;
        collect.sulfur *= per;

        return collect;
    }

    public static async endAttack(movementId: number) {
        const movement = await prisma.movement.findUnique({
            where: { id: movementId },
            include: {
                cityTo: { include: { userCities: { include: { user: true } } } },
                cityFrom: true,
                movementRegiments: { include: { regiment: { include: { regimentsUnits: { include: { unit: true } } } } } },
                user: { include: { resources: true } },
                resources: true
            }
        });

        if (!movement) return;

        // Actualizamos la cola de unidades de la ciudad destino
        const regiments = await prisma.regiment.findMany({
            where: { cityId: movement.cityTo.id, travel: 0 },
            include: { regimentsUnits: true }
        });
        for (const regiment of regiments) {
            await UnitBL.checkConstructedTime(regiment.id, regiment.userId);
        }

        // Finalizamos aatques y defensas de la ciudad destino
        await this.endAndReturnDefendCity(movement.cityToId, 'cityFromId');
        await this.endAndReturnDefendCity(movement.cityToId, 'cityToId');

        // Resolvemos combate
        const combatResult = await this.checkAttack(movement.movementRegiments[0].id, movement.cityTo.id);

        const userDestineId = movement.cityTo.userCities[0].userId;

        // Notificaciones (simulado)
        // await EventHelper.notifyUser(userDestineId, 'advisors', 'general');
        // await EventHelper.notifyUser(movement.userId, 'advisors', 'general');

        if (combatResult === 1) {
            // Ganó el atacante
            const transportTime = MovementBL.distanceTime(movement.cityFromId, movement.cityToId);

            await prisma.movement.update({
                where: { id: movement.id },
                data: {
                    delivered: true,
                    returnAt: dayjs().add(transportTime + world.load_attack_return, 'second').toDate()
                }
            });

            const size = movement.tradeShip * world.transport - movement.movementRegiments[0].size;

            const collect = await this.getResourceSteal(movement.cityTo.id, size);

            await CityBL.removeResources(movement.cityTo.id, collect);

            if (collect) {
                await prisma.movementResource.create({
                    data: {
                        movementId: movement.id,
                        wood: collect.wood,
                        wine: collect.wine,
                        marble: collect.marble,
                        glass: collect.glass,
                        sulfur: collect.sulfur
                    }
                });
            }


            // Notificación al dueño de la ciudad
            await prisma.mayor.create({
                data: {
                    cityId: movement.cityToId,
                    type: 6,
                    readed: 0,
                    data: JSON.stringify({
                        resources: movement.resources,
                        city_from: movement.cityTo.id,
                        city_name: movement.cityTo.name
                    })
                }
            });

            //   await EventHelper.notifyUser(userDestineId, 'advisors', 'mayor');

            await this.clearDefenses(movement.cityTo.id);

        } else {
            // Ganó el defensor
            await prisma.regiment.update({
                where: { id: movement.movementRegiments[0].regiment.id },
                data: { deletedAt: new Date() }
            });

            await prisma.userResource.update({
                where: { userId: movement.userId },
                data: {
                    tradeShipAvailable: { increment: movement.tradeShip }
                }
            });

            await prisma.movement.update({ where: { id: movement.id }, data: { deletedAt: new Date() } });
        }

        await UserResourceBL.updateResources(movement.userId);
    }

    public static async returnAttack(movementId: number) {
        const movement = await prisma.movement.findUnique({
            where: { id: movementId },
            include: {
                cityFrom: true,
                cityTo: true,
                movementRegiments: { include: { regiment: { include: { regimentsUnits: true } } } },
                user: { include: { resources: true } },
                resources: true
            }
        });

        if (!movement) return;

        // Actualizamos recursos de la ciudad de origen
        await CityBL.updateResources(movement.cityFrom.id);

        if (movement.resources) {
            await prisma.city.update({
                where: { id: movement.cityToId },
                data: {
                    wood: { increment: movement.resources.wood },
                    wine: { increment: movement.resources.wine },
                    marble: { increment: movement.resources.marble },
                    glass: { increment: movement.resources.glass },
                    sulfur: { increment: movement.resources.sulfur }
                }
            });
        }

        await UserResourceBL.updateResources(movement.userId);

        const regiment = movement.movementRegiments[0].regiment;

        const otherRegiment = await prisma.regiment.findFirst({
            where: {
                userId: movement.userId,
                travel: 0,
                cityId: movement.cityToId,
                id: { not: regiment.id }
            },
            include: { regimentsUnits: true }
        });

        if (otherRegiment) {
            for (const regUnit of regiment.regimentsUnits) {
                const otherUnit = otherRegiment.regimentsUnits.find(u => u.unitId === regUnit.unitId);
                if (otherUnit) {
                    await prisma.regimentUnit.update({
                        where: { id: otherUnit.id },
                        data: { cant: { increment: regUnit.cant } }
                    });
                } else {
                    await prisma.regimentUnit.create({
                        data: {
                            regimentId: otherRegiment.id,
                            unitId: regUnit.unitId,
                            cant: regUnit.cant
                        }
                    });
                }
                await prisma.regimentUnit.update({ where: { id: regUnit.id }, data: { deletedAt: new Date() } });
            }
            await prisma.regiment.update({ where: { id: regiment.id }, data: { deletedAt: new Date() } });
        } else {
            await prisma.regiment.update({
                where: { id: regiment.id },
                data: { travel: 0 }
            });
        }

        await prisma.userResource.update({
            where: { userId: movement.userId },
            data: { tradeShipAvailable: { increment: movement.tradeShip } }
        });

        await prisma.mayor.create({
            data: {
                cityId: movement.cityFromId,
                type: 7,
                readed: 0,
                data: JSON.stringify({
                    resources: movement.resources,
                    city_from: movement.cityTo.id,
                    city_name: movement.cityTo.name
                })
            }
        });

        // await EventHelper.notifyUser(movement.userId, 'advisors', 'mayor');

        await prisma.movement.update({ where: { id: movement.id }, data: { deletedAt: new Date() } });
    }

    static async endAndReturnAttackFromCity(cityId: number) {
        // Movimientos que el jugador inició desde esta ciudad
        const movementsEnd = await prisma.movement.findMany({
            where: {
                cityFromId: cityId,
                movementTypeId: 2,
                endAt: { lt: new Date() },
                delivered: false
            },
        });

        for (const movement of movementsEnd) {
            await this.endAttack(movement.id);
        }

        const movementsReturn = await prisma.movement.findMany({
            where: {
                cityFromId: cityId,
                movementTypeId: 2,
                returnAt: { lt: new Date() },
                delivered: true
            },
        });

        for (const movement of movementsReturn) {
            await this.returnAttack(movement.id);
        }
    }

    static async endAndReturnAttackToCity(cityId: number) {
        const movementsEnd = await prisma.movement.findMany({
            where: {
                cityToId: cityId,
                movementTypeId: 2,
                endAt: { lt: new Date() },
                delivered: false
            },
        });

        for (const movement of movementsEnd) {
            await this.endAttack(movement.id);
        }

        const movementsReturn = await prisma.movement.findMany({
            where: {
                cityToId: cityId,
                movementTypeId: 2,
                returnAt: { lt: new Date() },
                delivered: true
            },
        });

        for (const movement of movementsReturn) {
            await this.returnAttack(movement.id);
        }
    }

    static async transportDefend(movement: any) {
        const regiment = await prisma.regiment.update({
            where: { id: movement.movementRegiment.regimentId },
            data: {
                travel: 0,
                cityId: movement.cityDestineId,
            },
        });

        await prisma.movement.update({
            where: { id: movement.id },
            data: { delivered: true },
        });
    }

    static async returnDefend(movement: any) {
        const regiment = await prisma.regiment.findUnique({
            where: { id: movement.movementRegiment.regimentId },
        });

        if (regiment) {
            await prisma.regiment.update({
                where: { id: regiment.id },
                data: { travel: 1 },
            });

            const transportTime = MovementBL.distanceTime(
                movement.cityOrigin,
                movement.cityDestine
            );

            await prisma.movement.update({
                where: { id: movement.id },
                data: {
                    returnAt: addSeconds(new Date(), transportTime + world.load_defend_return),
                    delivered: true//2???
                },
            });
        } else {
            await prisma.userResource.updateMany({
                where: { userId: movement.userId },
                data: { tradeShipAvailable: { increment: movement.tradeShip } },
            });
            await prisma.movement.update({ where: { id: movement.id }, data: { deletedAt: new Date() } });
        }
    }

    static async endDefend(movement: any) {
        const regiment = await prisma.regiment.update({
            where: { id: movement.movementRegiment.regimentId },
            data: { travel: 0, cityId: movement.cityOriginId },
        });

        await prisma.userResource.updateMany({
            where: { userId: movement.userId },
            data: { tradeShipAvailable: { increment: movement.tradeShip } },
        });

        await prisma.movement.update({ where: { id: movement.id }, data: { deletedAt: new Date() } });
    }

    static async endAndReturnDefendCity(cityId: number, type: "cityFromId" | "cityToId") {
        const movementsEnd = await prisma.movement.findMany({
            where: {
                [type]: cityId,
                movementTypeId: 3,
                endAt: { lt: new Date() },
                delivered: false
            },
        });

        for (const movement of movementsEnd) {
            await this.transportDefend(movement);
        }

        const movementsReturn = await prisma.movement.findMany({
            where: {
                [type]: cityId,
                movementTypeId: 3,
                returnAt: { lt: new Date() },
                delivered: true
            },
        });

        for (const movement of movementsReturn) {
            await this.returnDefend(movement);
        }

        const movementsFinish = await prisma.movement.findMany({
            where: {
                [type]: cityId,
                movementTypeId: 3,
                returnAt: { lt: new Date() },
                delivered: true//2????
            },
        });

        for (const movement of movementsFinish) {
            await this.endDefend(movement);
        }
    }

    static async clearDefenses(cityId: number) {
        const movements = await prisma.movement.findMany({
            where: {
                cityToId: cityId,
                movementTypeId: 3,
                endAt: { lt: new Date() },
                delivered: true
            },
            include: { movementRegiments: { include: { regiment: { include: { regimentsUnits: true } } } } },
        });

        for (const movement of movements) {
            const regiment = movement.movementRegiments[0].regiment;
            if (regiment.regimentsUnits.length === 0) {
                await prisma.regiment.update({ where: { id: regiment.id }, data: { deletedAt: new Date() } });
                await prisma.userResource.updateMany({
                    where: { userId: movement.userId },
                    data: { tradeShipAvailable: { increment: movement.tradeShip } },
                });
                await prisma.movement.update({ where: { id: movement.id }, data: { deletedAt: new Date() } });
            }
        }
    }
}