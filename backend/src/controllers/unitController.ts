import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { UnitBL } from './../businessLogic/unitBL';
import { PopulationBL } from './../businessLogic/populationBL';
import { BuildingModifierBL } from './../businessLogic/buildingModifierBL';
import { CityBL } from './../businessLogic/cityBL';
import { validateFields } from '../utils/validateFields';
import { RequestUnitCreate, RequestUnitCity } from '@shared/types/requests';
import { Resources } from '@shared/types/others';
import { ResponseUnitCreate, ResponseUnitCity } from '@shared/types/responses';

export class UnitController {

    public async create(req: Request, res: Response) {
        const { units, cants, cityId }: RequestUnitCreate = validateFields(req, [
            { name: "units", type: "number[]", required: true },
            { name: "cants", type: "number[]", required: true },
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        if (units.length !== cants.length) {
            throw new Error("Units and cants array length mismatch");
        }

        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { population: true } });
        if (!city) throw new Error("City not found");

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
        if (maxTail > 2) throw new Error("Max number of tails reached");

        const unitsDb = await prisma.unit.findMany({ where: { id: { in: units } } });

        const collect = UnitBL.newCollect();
        for (let i = 0; i < units.length; i++) {
            const unit = unitsDb.find(u => u.id === units[i]);
            if (!unit) throw new Error(`Unit ${units[i]} does not exist`);
            if (!UnitBL.checkBarrackLevel(city.id, unit)) {
                throw new Error("Barrack level too low");
            }
            if (!UnitBL.checkResearch(unit.id, userId)) {
                throw new Error("Research requirements not met");
            }
            UnitBL.addCollect(collect, unit, cants[i]);
        }

        if (!PopulationBL.comparePopulation(city, collect)) {
            throw new Error("Not enough population");
        }

        await BuildingModifierBL.lessCost(userId, city.id, collect);
        if (!CityBL.compareResources(city.id, collect)) {
            throw new Error("Not enough resources");
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

        //get resources
        const cityUpdated = await prisma.city.findUniqueOrThrow({ where: { id: cityId } });

        const updatedResources: Resources = {
            wood: cityUpdated.wood,
            marble: cityUpdated.marble,
            wine: cityUpdated.wine,
            glass: cityUpdated.glass,
            sulfur: cityUpdated.sulfur
        }

        //get population
        const population = await prisma.cityPopulation.findUniqueOrThrow({ where: { cityId } });

        const response: ResponseUnitCreate = {
            resources: updatedResources,
            population: {
                populationAvailable: PopulationBL.getAvailablePopulation(population),
                population: population.population
            }
        }

        return res.json(response);
    }

    public async city(req: Request, res: Response){
        const { cityId }: RequestUnitCity = validateFields(req, [
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        const data = await UnitBL.getData(userId, cityId);
        const response: ResponseUnitCity = {
            units: data.units.filter(u=> u.cant > 0)
        };

        res.json(response);
    }
}