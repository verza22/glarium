import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { UnitBL } from './../businessLogic/unitBL';
import { PopulationBL } from './../businessLogic/populationBL';
import { BuildingModifierBL } from './../businessLogic/buildingModifierBL';
import { CityBL } from './../businessLogic/cityBL';

export class UnitController {

    public async create(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.id);

        const { units, cants } = req.body;
        if (!Array.isArray(units) || !units.every((u: any) => Number.isInteger(u)) ||
            !Array.isArray(cants) || !cants.every((c: any) => Number.isInteger(c))) {
            return res.status(400).json({ error: "Invalid units or cants" });
        }

        if (units.length !== cants.length) {
            return res.status(400).json({ error: "Units and cants array length mismatch" });
        }

        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { population: true } });
        if (!city) return res.status(404).json({ error: "City not found" });

        // Check if regiment exists
        let regiment = await prisma.regiment.findFirst({
            where: { userId, cityId }
        });

        if (!regiment) {
            // If it doesn't exist, create a new regiment
            regiment = await prisma.regiment.create({
                data: { userId, cityId, travel: 0 }
            });
        }

        await UnitBL.checkConstructedTime(regiment.id, userId);

        const cityPopulation = await prisma.cityPopulation.findUniqueOrThrow({ where: { cityId } });
        await PopulationBL.satisfaction(userId, cityPopulation);

        const tails = await prisma.regimentTail.findMany({ where: { regimentId: regiment.id } });
        let maxTail = tails.length ? Math.max(...tails.map(t => t.tail)) + 1 : 0;
        if (maxTail > 2) return res.status(400).json({ error: "Max number of tails reached" });

        const unitsDb = await prisma.unit.findMany({ where: { id: { in: units } } });

        const collect = UnitBL.newCollect();
        for (let i = 0; i < units.length; i++) {
            const unit = unitsDb.find(u => u.id === units[i]);
            if (!unit) return res.status(400).json({ error: `Unit ${units[i]} does not exist` });
            if (!UnitBL.checkBarrackLevel(city.id, unit)) {
                return res.status(400).json({ error: "Barrack level too low" });
            }
            if (!UnitBL.checkResearch(unit.id, userId)) {
                return res.status(400).json({ error: "Research requirements not met" });
            }
            UnitBL.addCollect(collect, unit, cants[i]);
        }

        if (!PopulationBL.comparePopulation(city, collect)) {
            return res.status(400).json({ error: "Not enough population" });
        }

        await BuildingModifierBL.lessCost(userId, city.id, collect);
        if (!CityBL.compareResources(city.id, collect)) {
            return res.status(400).json({ error: "Not enough resources" });
        }

        await CityBL.removeResources(city.id, collect);
        await PopulationBL.removePopulation(city.id, collect);

        for (let i = 0; i < units.length; i++) {
            const unit = unitsDb.find(u => u.id === units[i]);
            if (unit)
                await prisma.regimentTail.create({
                    data: {
                        regimentId: regiment.id,
                        unitId: unit.id,
                        cant: cants[i],
                        tail: maxTail,
                        constructedAt: new Date(Date.now() + collect.time * 1000)
                    }
                });
        }

        return res.json("ok");
    }

    public async index(req: Request, res: Response) {
        const userId = Number(req.params.id);
        await UnitBL.allConstructTails(userId);

        const regiments = await prisma.regiment.findMany({
            where: { userId: userId },
            include: {
                regimentTails: true,
                regimentsUnits: { include: { unit: true } }
            }
        });

        const data = regiments.map(r => ({
            id: r.id,
            city_id: r.cityId,
            tails: r.regimentTails,
            units: r.regimentsUnits.map(u => ({
                cant: u.cant,
                unit_id: u.unitId,
                size: u.unit.size
            }))
        }));

        return res.json(data);
    }
}