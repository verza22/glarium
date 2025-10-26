import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { CityBL } from './../businessLogic/cityBL';
import { PopulationBL } from './../businessLogic/populationBL';
import { MovementBL } from './../businessLogic/movementBL';
import { UserResourceBL } from './../businessLogic/userResourceBL';
import { RequestCityGetInfo, RequestCitySetScientists, RequestCitySetWine } from '@shared/types/requests';
import { validateFields } from '../utils/validateFields';
import { CityFlat } from '@shared/types/models';
import { ResponseCityGetInfo } from '@shared/types/responses';

export class CityController {

    public async getInfo(req: Request, res: Response) {
        const { cityId }: RequestCityGetInfo = validateFields(req, [
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        const response: ResponseCityGetInfo = {
            cities: await this.getCities(userId),
            population: await this.getPopulation(userId, cityId),
            actionPoints: await this.getActionPoint(userId, cityId),
            resources: await this.getResources(userId, cityId),
            userResources: await this.getUserResources(userId)
        };

        res.json(response);
    }

    private async getCities(userId: number): Promise<CityFlat[]> {
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

        const data: CityFlat[] = userCities.map(uc => {
            if(!uc.city.islandCity)
                throw new Error("Invalid islandCity");

            return {
                id: uc.cityId,
                name: uc.city.name,
                capital: uc.capital,
                island_id: uc.city.islandCity?.island.id,
                x: uc.city.islandCity?.island.x,
                y: uc.city.islandCity?.island.y,
                type: uc.city.islandCity?.island.type
            }
        });

        return data;
    }

    private async getPopulation(userId: number, cityId: number) {
        // Check ownership
        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { population: true, userCities: true } });
        if (!city || city.userCities[0].userId !== userId) {
            throw new Error("Unauthorized");
        }

        await CityBL.updateResources(city.id);
        if (city.population) {
            await PopulationBL.satisfaction(userId, city.population, false);

            return {
                population: Math.floor(city.population.populationMax),
                populationAvailable: PopulationBL.getAvailablePopulation(city.population),
                workerForest: city.population.workerForest,
                workerMine: city.population.workerMine,
                scientists: city.population.scientists,
                wine: city.population.wine
            };
        } else {
            throw new Error("City population error");
        }
    }

    private async getActionPoint(userId: number, cityId: number) {
        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) throw new Error("City not found");

        const pointUsed = await MovementBL.getActionPoint(city.id, userId);
        return { pointMax: city.apoint, point: city.apoint - pointUsed };
    }

    private async getUserResources(userId: number) {
        await UserResourceBL.updateResources(userId);
        return prisma.userResource.findFirstOrThrow({ where: { userId }, select: { gold: true, tradeShip: true, tradeShipAvailable: true } });
    }

    private async getResources(userId: number, cityId: number) {
        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { userCities: true } });
        if (!city || city.userCities[0].userId !== userId) throw new Error("Unauthorized");

        await CityBL.updateResources(city.id);
        return {
            wood: city.wood,
            wine: city.wine,
            marble: city.marble,
            glass: city.glass,
            sulfur: city.sulfur
        };
    }

    public async setScientists(req: Request, res: Response) {
        const { cityId, scientists }: RequestCitySetScientists = validateFields(req, [
            { name: "cityId", type: "number", required: true },
            { name: "scientists", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        const cityPopulation = await prisma.cityPopulation.findUnique({ where: { cityId } });
        if (!cityPopulation) throw new Error("City population not found");
        if (scientists > cityPopulation.scientistsMax) throw new Error("Too many scientists");

        await PopulationBL.satisfaction(userId, cityPopulation);

        const diff = scientists - cityPopulation.scientists;
        if (diff > cityPopulation.population) throw new Error("Not enough citizens");

        await UserResourceBL.updateResources(userId);

        await prisma.cityPopulation.update({
            where: { cityId },
            data: {
                population: cityPopulation.population - diff,
                scientists
            }
        });

        //get populationAvailable
        const newCityPopulation = await prisma.cityPopulation.findUniqueOrThrow({
            where: { cityId: cityId },
        });
        const populationAvailable = PopulationBL.getAvailablePopulation(newCityPopulation);

        return res.json(populationAvailable);
    }

    public async setWine(req: Request, res: Response) {
        const { cityId, wine }: RequestCitySetWine = validateFields(req, [
            { name: "cityId", type: "number", required: true },
            { name: "wine", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        const cityPopulation = await prisma.cityPopulation.findUnique({ where: { cityId } });
        const city = await prisma.city.findUnique({ where: { id: cityId } });

        if (!cityPopulation || !city) throw new Error("City not found" );
        if (wine > cityPopulation.wineMax) throw new Error("Wine exceeds max");
        if (wine > city.wine) throw new Error("Not enough wine in city");

        await CityBL.updateResources(city.id);
        await PopulationBL.satisfaction(userId, cityPopulation);
        await prisma.cityPopulation.update({ where: { cityId }, data: { wine } });
        await UserResourceBL.updateResources(userId);

        return res.json(wine);
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