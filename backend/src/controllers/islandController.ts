import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { BuildingBL } from './../businessLogic/buildingBL';
import { IslandBL } from './../businessLogic/islandBL';
import { PopulationBL } from './../businessLogic/populationBL';
import { CityBL } from './../businessLogic/cityBL';
import { UserResourceBL } from './../businessLogic/userResourceBL';
import { UnitBL } from './../businessLogic/unitBL';
import { addSeconds } from 'date-fns';
import { validateFields } from '../utils/validateFields';
import { RequestIslandGetData, RequestIslandGetInfo, RequestIslandSetDonation, RequestIslandSetWorker } from '@shared/types/requests';
import { ResponseIslandGetData, ResponseIslandGetInfo, ResponseIslandSetWorker } from '@shared/types/responses';
import dayjs from 'dayjs';
import { Resources } from '@shared/types/others';

export class IslandController {

    public async getInfo(req: Request, res: Response) {
        const { islandId }: RequestIslandGetInfo = validateFields(req, [
            { name: "islandId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        // Get island with related forest, mine, and cities
        const island = await prisma.island.findUnique({
            where: { id: islandId },
            include: {
                forest: true,
                mine: true,
                islandCity: {
                    include: {
                        city: {
                            include: {
                                userCities: {
                                    include: { user: true },
                                },
                                cityBuildings: {
                                    include: { buildingLevel: true }
                                }
                            },
                        },
                    },
                },
            },
        });

        if (!island) {
            return res.status(404).json({ error: "Island not found" });
        }

        // Get user cities for this user
        const userCities = await prisma.userCity.findMany({
            where: { userId: userId },
            select: { cityId: true },
        });
        const userCityIds = userCities.map((uc) => uc.cityId);

        //TODO improve this for remove cities in batch process
        const cities = island.islandCity.filter(x=> x.city.deletedAt === null);

        // Build island data
        const data: ResponseIslandGetInfo = {
            id: island.id,
            x: island.x,
            y: island.y,
            name: island.name,
            type: island.type,
            levelForest: island.forest?.level ?? 0,
            levelMine: island.mine?.level ?? 0,
            cities: cities.map((islandCity) => {
                const city = islandCity.city;
                let level = 1;
                const townHallIndex = islandCity.city.cityBuildings.findIndex(b => b.buildingLevel.buildingId === 1);
                if (townHallIndex >= 0)
                    level = islandCity.city.cityBuildings[townHallIndex].buildingLevel.level;

                return {
                    cityId: islandCity.cityId,
                    position: islandCity.position,
                    // If city not constructed, level = 0
                    level: level,
                    constructedAt: city.constructedAt ? city.constructedAt : new Date(),
                    user: city.userCities[0]?.user?.name ?? null,
                    userId: city.userCities[0]?.userId ?? null,
                    name: city.name,
                    // true if the city belongs to current user
                    type: userCityIds.includes(city.id),
                };
            }),
        };

        return res.json(data);
    }

    public async getData(req: Request, res: Response) {
        const { islandId, type }: RequestIslandGetData = validateFields(req, [
            { name: "islandId", type: "number", required: true },
            { name: "type", type: "boolean", required: true }
        ]);
        const userId = req.authUser.userId;

        //check donations
        await IslandBL.checkUpgrades(islandId);

        const island = await prisma.island.findUniqueOrThrow({
            where: { id: islandId },
            include: { forest: true, mine: true },
        });

        // Check island workers capacity
        const maxWorkers = type ? island.forest.workers : island.mine.workers;
        const islandLevel = type ? island.forest.level : island.mine.level;
        const constructedAtDate = type ? island.forestConstructedAt : island.mineConstructedAt;
        const donated = type ? island.donatedForest : island.donatedMine;

        let constructedAt = null;
        if (constructedAtDate !== null)
            constructedAt = dayjs(constructedAtDate).format('YYYY-MM-DD HH:mm:ss');

        let nextWood = 0;
        if (type) {
            const nextForest = await prisma.forest.findFirst({ where: { level: islandLevel + 1 } });
            if (nextForest) {
                nextWood = nextForest.wood;
            }
        } else {
            const nextMine = await prisma.mine.findFirst({ where: { level: islandLevel + 1 } });
            if (nextMine) {
                nextWood = nextMine.wood;
            }
        }

        let donations: {
            id: number;
            cityId: number;
            donated: number;
            workers?: number;
        }[] = await prisma.islandDonation.findMany({ where: { islandId, type: type ? 1 : 0 }, select: { id: true, cityId: true, donated: true } });

        const islandCities = await prisma.islandCity.findMany({ where: { islandId }, include: { city: { include: { population: true } } } });

        islandCities.forEach(x => {
            let index = donations.findIndex(y => y.cityId === x.cityId);
            if (index >= 0)
                donations[index].workers = type ? x.city.population?.workerForest : x.city.population?.workerMine;
        });

        const result: ResponseIslandGetData = {
            donations,
            maxWorkers,
            nextWood,
            constructedAt,
            donated
        }

        return res.json(result);
    }

    public async setWorker(req: Request, res: Response) {
        const { workers, type, cityId }: RequestIslandSetWorker = validateFields(req, [
            { name: "workers", type: "number", required: true },
            { name: "type", type: "boolean", required: true },
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        // Validate input
        if (typeof workers !== "number" || workers < 0) {
            throw new Error("workers must be a non-negative number");
        }
        if (typeof type !== "boolean") {
            throw new Error("type must be a boolean");
        }

        const userCity = await prisma.userCity.findFirst({ where: { userId, cityId } });
        if (!userCity) throw new Error("Forbidden");

        // Define type of workers
        const targetType = type ? "forest" : "mine";
        const workersKey = type ? "workerForest" : "workerMine";

        // Get city population
        const cityPopulation = await prisma.cityPopulation.findUnique({
            where: { cityId: cityId },
        });
        if (!cityPopulation) {
            throw new Error("City population not found");
        }

        // Get island of the city
        const islandCity = await prisma.islandCity.findUnique({
            where: { cityId: cityId },
            include: { island: { include: { forest: true, mine: true } } },
        });
        if (!islandCity) {
            throw new Error("Island city not found");
        }

        // Check island workers capacity
        const islandWorkers =
            targetType === "forest"
                ? islandCity.island.forest?.workers ?? 0
                : islandCity.island.mine?.workers ?? 0;

        if (workers > islandWorkers) {
            throw new Error("You cannot assign more workers than the island allows");
        }

        // Check population satisfaction
        await PopulationBL.satisfaction(userId, cityPopulation);

        // Calculate worker difference
        const currentWorkers = (cityPopulation as any)[workersKey] ?? 0;
        const workersDiff = workers - currentWorkers;

        if (workersDiff > cityPopulation.population) {
            throw new Error("You cannot assign more workers than available citizens");
        }

        // Update population and workers
        const updatedPopulation = await prisma.cityPopulation.update({
            where: { cityId: cityId },
            data: {
                population: cityPopulation.population - workersDiff,
                [workersKey]: workers,
            },
        });

        // Update city resources
        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (city) {
            await CityBL.updateResources(city.id);
        }

        // Update user resources
        await UserResourceBL.updateResources(userId);

        //get populationAvailable
        const newCityPopulation = await prisma.cityPopulation.findUniqueOrThrow({
            where: { cityId: cityId },
        });
        const populationAvailable = PopulationBL.getAvailablePopulation(newCityPopulation);

        const response: ResponseIslandSetWorker = {
            populationAvailable
        }

        return res.json(response);
    }

    // Main entrypoint for donation
    public async setDonation(req: Request, res: Response) {
        const { islandId, wood, type, cityId }: RequestIslandSetDonation = validateFields(req, [
            { name: "islandId", type: "number", required: true },
            { name: "type", type: "boolean", required: true },
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        // Verify city belongs to user
        const userCity = await prisma.userCity.findFirst({
            where: { userId: userId, cityId: cityId },
        });
        if (!userCity) {
            throw new Error("This city does not exist or does not belong to you");
        }

        // Verify city is part of the island
        const islandCity = await prisma.islandCity.findFirst({
            where: { islandId: islandId, cityId: cityId },
        });
        if (!islandCity) {
            throw new Error("This city is not part of the island you want to donate to");
        }

        // Dispatch based on type
        if (type) {
            await this.donatedForest(res, islandId, cityId, wood);
        } else {
            await this.donatedMine(res, islandId, cityId, wood);
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

        res.json(updatedResources);
    }

    // Donate to the forest
    private async donatedForest(res: Response, islandId: number, cityId: number, wood: number) {
        // Clear expired construction
        await prisma.island.updateMany({
            where: { id: islandId, forestConstructedAt: { lt: new Date() } },
            data: { forestConstructedAt: null },
        });

        const island = await prisma.island.findUnique({
            where: { id: islandId },
            include: { forest: true },
        });

        if (!island) throw new Error("Island not found");
        if (island.forestConstructedAt) {
            throw new Error("Forest is already under construction");
        }

        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) throw new Error("City not found");

        // Update resources of the city
        await CityBL.updateResources(city.id);

        // Check if city has enough wood
        const collect = UnitBL.newCollect();
        collect.wood = wood;

        const hasResources = await CityBL.compareResources(city.id, collect);
        if (!hasResources) {
            throw new Error("Not enough resources");
        }

        const nextLevel = await prisma.forest.findFirst({
            where: { level: island.forest.level + 1 },
        });
        if (!nextLevel) {
            throw new Error("Next forest level not found");
        }

        const needToUpgrade = nextLevel.wood - island.donatedForest;

        if (collect.wood >= needToUpgrade) {
            // Upgrade island
            collect.wood = needToUpgrade;
            await CityBL.removeResources(city.id, collect);

            await prisma.island.update({
                where: { id: islandId },
                data: {
                    forestConstructedAt: addSeconds(new Date(), nextLevel.time),
                    donatedForest: 0, // optional, depending on your original logic
                },
            });
        } else {
            // Just donate
            await CityBL.removeResources(city.id, collect);

            await prisma.island.update({
                where: { id: islandId },
                data: { donatedForest: { increment: collect.wood } },
            });
        }

        // Update individual donation
        const existingDonation = await prisma.islandDonation.findFirst({
            where: {
                islandId: islandId,
                cityId: cityId,
                type: 1,
            },
        });

        if (existingDonation) {
            // Si existe, actualizamos sumando
            await prisma.islandDonation.update({
                where: { id: existingDonation.id },
                data: {
                    donated: {
                        increment: collect.wood,
                    },
                },
            });
        } else {
            // Si no existe, creamos
            await prisma.islandDonation.create({
                data: {
                    islandId: islandId,
                    cityId: cityId,
                    type: 1,
                    donated: collect.wood,
                },
            });
        }

        return "ok";
    }

    // Donate to the mine
    private async donatedMine(res: Response, islandId: number, cityId: number, wood: number) {
        // Clear expired construction
        await prisma.island.updateMany({
            where: { id: islandId, mineConstructedAt: { lt: new Date() } },
            data: { mineConstructedAt: null },
        });

        const island = await prisma.island.findUnique({
            where: { id: islandId },
            include: { mine: true },
        });

        if (!island) throw new Error("Island not found");
        if (island.mineConstructedAt) {
            throw new Error("Mine is already under construction");
        }

        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) throw new Error("City not found");

        // Update resources of the city
        await CityBL.updateResources(city.id);

        // Check if city has enough wood
        const collect = UnitBL.newCollect();
        collect.wood = wood;

        const hasResources = await CityBL.compareResources(city.id, collect);
        if (!hasResources) {
            throw new Error("Not enough resources");
        }

        const nextLevel = await prisma.mine.findFirst({
            where: { level: island.mine.level + 1 },
        });
        if (!nextLevel) {
            throw new Error("Next mine level not found");
        }

        const needToUpgrade = nextLevel.wood - island.donatedMine;

        if (collect.wood >= needToUpgrade) {
            // Upgrade island
            collect.wood = needToUpgrade;
            await CityBL.removeResources(city.id, collect);

            await prisma.island.update({
                where: { id: islandId },
                data: {
                    mineConstructedAt: addSeconds(new Date(), nextLevel.time),
                    donatedMine: 0, // optional
                },
            });
        } else {
            // Just donate
            await CityBL.removeResources(city.id, collect);

            await prisma.island.update({
                where: { id: islandId },
                data: { donatedMine: { increment: collect.wood } },
            });
        }

        // Update individual donation
        const existingDonation = await prisma.islandDonation.findFirst({
            where: {
                islandId: islandId,
                cityId: cityId,
                type: 0,
            },
        });

        if (existingDonation) {
            // If exists, increment the donated amount
            await prisma.islandDonation.update({
                where: { id: existingDonation.id },
                data: {
                    donated: {
                        increment: collect.wood,
                    },
                },
            });
        } else {
            // If it doesn't exist, create a new donation record
            await prisma.islandDonation.create({
                data: {
                    islandId: islandId,
                    cityId: cityId,
                    type: 0,
                    donated: collect.wood,
                },
            });
        }

        return "ok";
    }
}