import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { CityBL } from './../businessLogic/cityBL';
import { PopulationBL } from './../businessLogic/populationBL';
import { MovementBL } from './../businessLogic/movementBL';
import { UserResourceBL } from './../businessLogic/userResourceBL';

export class CityController {

    public async getCities(req: Request, res: Response) {
        const userId = Number(req.params.userId);

        const userCities = await prisma.userCity.findMany({
            where: { userId, city: { constructedAt: { not: null } } },
            include: {
                city: {
                    include: {
                        islandCity: {
                            include: { island: true }
                        }
                    }
                }
            }
        });

        const data = userCities.map(uc => ({
            id: uc.cityId,
            name: uc.city.name,
            capital: uc.capital,
            island_id: uc.city.islandCity?.island.id,
            x: uc.city.islandCity?.island.x,
            y: uc.city.islandCity?.island.y,
            type: uc.city.islandCity?.island.type
        }));

        return res.json(data);
    }

    public async getPopulation(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);

        // Check ownership
        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { population: true, userCities: true } });
        if (!city || city.userCities[0].userId !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await CityBL.updateResources(city.id);
        if (city.population) {
            await PopulationBL.satisfaction(userId, city.population, false);

            return res.json({
                population_max: city.population.populationMax,
                population: city.population.population,
                worker_forest: city.population.workerForest,
                worker_mine: city.population.workerMine,
                scientists_max: city.population.scientistsMax,
                scientists: city.population.scientists,
                wine: city.population.wine,
                wine_max: city.population.wineMax
            });
        } else {
            return res.status(400).json({ error: "City population error" });
        }
    }

    public async getActionPoint(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);

        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) return res.status(404).json({ error: "City not found" });

        const pointUsed = await MovementBL.getActionPoint(city.id, userId);
        return res.json({ point_max: city.apoint, point: city.apoint - pointUsed });
    }

    public async getResources(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);

        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { userCities: true } });
        if (!city || city.userCities[0].userId !== userId) return res.status(403).json({ error: "Unauthorized" });

        await CityBL.updateResources(city.id);
        return res.json({
            wood: city.wood,
            wine: city.wine,
            marble: city.marble,
            glass: city.glass,
            sulfur: city.sulfur
        });
    }

    public async setScientists(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);
        const { scientists } = req.body;

        const cityPopulation = await prisma.cityPopulation.findUnique({ where: { cityId } });
        if (!cityPopulation) return res.status(404).json({ error: "City population not found" });
        if (scientists > cityPopulation.scientistsMax) return res.status(400).json({ error: "Too many scientists" });

        await PopulationBL.satisfaction(userId, cityPopulation);

        const diff = scientists - cityPopulation.scientists;
        if (diff > cityPopulation.population) return res.status(400).json({ error: "Not enough citizens" });

        await UserResourceBL.updateResources(userId);

        await prisma.cityPopulation.update({
            where: { cityId },
            data: {
                population: cityPopulation.population - diff,
                scientists
            }
        });

        return res.json("ok");
    }

    public async setWine(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);
        const { wine } = req.body;

        const cityPopulation = await prisma.cityPopulation.findUnique({ where: { cityId } });
        const city = await prisma.city.findUnique({ where: { id: cityId } });

        if (!cityPopulation || !city) return res.status(404).json({ error: "City not found" });
        if (wine > cityPopulation.wineMax) return res.status(400).json({ error: "Wine exceeds max" });
        if (wine > city.wine) return res.status(400).json({ error: "Not enough wine in city" });

        await CityBL.updateResources(city.id);
        await PopulationBL.satisfaction(userId, cityPopulation);
        await prisma.cityPopulation.update({ where: { cityId }, data: { wine } });
        await UserResourceBL.updateResources(userId);

        return res.json("ok");
    }

    public async setName(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);
        const { name } = req.body;
        if (!name || name.length > 50) return res.status(400).json({ error: "Invalid name" });

        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { userCities: true } });
        if (!city || city.userCities[0].userId !== userId) return res.status(403).json({ error: "Unauthorized" });

        await prisma.city.update({ where: { id: cityId }, data: { name } });
        return res.json("ok");
    }
}