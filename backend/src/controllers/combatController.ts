import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { MovementBL } from './../businessLogic/movementBL';
import { world } from './../config';
import { UserResourceBL } from './../businessLogic/userResourceBL';
import { validateFields } from '../utils/validateFields';
import { RequestCombatMovement } from '@shared/types/requests';

export class CombatController {

    public async combatMovement(req: Request, res: Response) {
        const { cityFromId, units, cants, tradeShip, cityId }: RequestCombatMovement = validateFields(req, [
            { name: "cityFromId", type: "number", required: true },
            { name: "units", type: "number[]", required: true },
            { name: "cants", type: "number[]", required: true },
            { name: "tradeShip", type: "number", required: true },
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;


        let type = 2;//2 attack, 3 defense
        let hours = 0;

        if (!cityFromId || !units || !cants || !tradeShip) {
            throw new Error("Missing required parameters");
        }

        if (cityFromId === cityId) {
            throw new Error("Cannot attack your own city");
        }

        // Check regiment exists and not traveling
        let regiment = await prisma.regiment.findFirst({
            where: { userId, cityId: cityFromId, travel: 0 },
            include: { regimentsUnits: { include: { unit: true } } }
        });
        if (!regiment) throw new Error("No regiment in this city");
        let regimentId: number = regiment.id;

        const cityFrom = await prisma.city.findUnique({ where: { id: cityFromId } });
        if (!cityFrom) throw new Error("Origin city not found");

        // Check action points
        const apoint = await MovementBL.getActionPoint(cityFrom.id, userId);
        if (apoint >= cityFrom.apoint) {
            throw new Error("Reached max action points");
        }

        // Check trade ships
        const userResource = await prisma.userResource.findUnique({ where: { userId } });
        if (!userResource || tradeShip > userResource.tradeShipAvailable) {
            throw new Error("Not enough trade ships");
        }

        // Validate units and cants
        if (units.length !== cants.length) {
            throw new Error("Units and counts mismatch");
        }

        let newRegiment = false;
        let sizeRegiment = 0;

        for (let i = 0; i < units.length; i++) {
            const unitAux = units[i];
            const cant = cants[i];
            const regimentUnit = regiment.regimentsUnits.find(u => u.unitId === unitAux);

            if (!regimentUnit) throw new Error(`Unit ${unitAux} not found in regiment`);

            sizeRegiment += regimentUnit.unit.size * cant;

            if (cant > regimentUnit.cant) throw new Error("Not enough troops");
            if (cant !== regimentUnit.cant) newRegiment = true;
        }

        if (sizeRegiment > tradeShip * world.transport) {
            throw new Error("Not enough transport capacity");
        }

        // Create new regiment if needed
        if (newRegiment) {
            const newRegimentRec = await prisma.regiment.create({ data: { userId, cityId: cityFromId, travel: 0 } });
            for (let i = 0; i < units.length; i++) {
                const regimentUnit = regiment.regimentsUnits.find(u => u.unitId === units[i]);
                if (regimentUnit) {
                    const cant = cants[i];

                    // Subtract troops from original regiment
                    await prisma.regimentUnit.update({
                        where: { id: regimentUnit.id },
                        data: { cant: regimentUnit.cant - cant }
                    });

                    await prisma.regimentUnit.create({
                        data: { regimentId: newRegimentRec.id, unitId: regimentUnit.unitId, cant }
                    });
                }
            }
            regimentId = newRegimentRec.id;
        }

        // Calculate movement times
        const loadedTime = await MovementBL.loadedSpeed(cityFrom.id, sizeRegiment);
        const transportTime = await MovementBL.distanceTime(cityFrom.id, cityId);

        const startAt = new Date(Date.now() + loadedTime * 1000);
        const endAt = new Date(Date.now() + (transportTime + loadedTime) * 1000);
        const returnAt = type === 3 ? new Date(Date.now() + (transportTime + loadedTime + hours * 3600) * 1000) : null;

        // Create movement
        const movement = await prisma.movement.create({
            data: {
                startAt,
                endAt,
                returnAt,
                userId,
                cityFromId: cityFromId,
                cityToId: cityId,
                movementTypeId: type,
                tradeShip: tradeShip,
                delivered: false,
                cancelled: false
            }
        });

        await prisma.movementRegiment.create({
            data: { movementId: movement.id, regimentId: regimentId, size: sizeRegiment }
        });

        // Update resources and regiment travel status
        await UserResourceBL.updateResources(userId);
        await prisma.regiment.update({ where: { id: regimentId }, data: { travel: 1 } });
        await prisma.userResource.update({ where: { userId }, data: { tradeShipAvailable: userResource.tradeShipAvailable - tradeShip } });

        return res.json("ok");
    }

    // public async attack(req: Request, res: Response) {
    //     const cityId = Number(req.params.cityId);
    //     return this.combatMovement(req, res, cityId, 2);
    // }

    // public async defend(req: Request, res: Response) {
    //     const cityId = Number(req.params.cityId);
    //     return this.combatMovement(req, res, cityId, 3);
    // }

    public async index(req: Request, res: Response) {
        const userId = Number(req.params.userId);
        const cities = await prisma.userCity.findMany({ where: { userId }, select: { cityId: true } });

        const count = await prisma.movement.count({
            where: {
                OR: [
                    { userId, movementTypeId: { in: [2, 3] } },
                    { cityToId: { in: cities.map(c => c.cityId) } }
                ]
            }
        });

        return res.json({ count });
    }
}