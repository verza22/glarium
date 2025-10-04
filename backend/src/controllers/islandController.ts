import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { BuildingBL } from './../businessLogic/buildingBL';
import { IslandBL } from './../businessLogic/islandBL';
import { PopulationBL } from './../businessLogic/populationBL';
import { CityBL } from './../businessLogic/cityBL';
import { UserResourceBL } from './../businessLogic/userResourceBL';
import { UnitBL } from './../businessLogic/unitBL';
import { addSeconds } from 'date-fns';

export class IslandController {
    static async show(req: Request, res: Response) {
        try {
            const islandId = parseInt(req.params.id, 10);
            const userId = Number(req.params.userId);

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

            // Build island data
            const data: any = {
                id: island.id,
                x: island.x,
                y: island.y,
                name: island.name,
                type: island.type,
                level_forest: island.forest?.level ?? 0,
                level_mine: island.mine?.level ?? 0,
                cities: island.islandCity.map(async (islandCity) => {
                    const city = islandCity.city;
                    const cityData: any = {
                        city_id: islandCity.cityId,
                        position: islandCity.position,
                        // If city not constructed, level = 0
                        level:
                            city.constructedAt === null
                                ? 0
                                : (await BuildingBL.building(city.id, 1))?.buildingLevel.level,
                        constructed_at: city.constructedAt,
                        user: city.userCities[0]?.user?.name ?? null,
                        user_id: city.userCities[0]?.userId ?? null,
                        name: city.name,
                        // true if the city belongs to current user
                        type: userCityIds.includes(city.id),
                    };
                    return cityData;
                }),
            };

            return res.json(data);
        } catch (error) {
            console.error("Error showing island:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async donation(req: Request, res: Response) {
        try {
            const islandId = parseInt(req.params.id, 10);
            const { type } = req.body; // expected boolean (0 = mine, 1 = forest)

            if (typeof type !== "boolean") {
                return res.status(400).json({ error: "Type must be a boolean" });
            }

            // Get island with relations
            const island = await prisma.island.findUnique({
                where: { id: islandId },
                include: {
                    forest: true,
                    mine: true,
                    donations: {
                        include: {
                            city: {
                                include: {
                                    userCities: { include: { user: true } },
                                    population: true, // assuming population is a relation
                                },
                            },
                        },
                    }
                },
            });

            if (!island) {
                return res.status(404).json({ error: "Island not found" });
            }

            // Call helper to check upgrades (logic must be implemented)
            await IslandBL.checkUpgrades(island.id);

            let donations: any[];
            let workersKey: string;
            let donatedKey: keyof typeof island;
            const data: any = { info: {}, donations: [] };
            let next: any;

            if (type) {
                // Forest
                donations = island.donations;
                workersKey = "worker_forest";
                donatedKey = "donatedForest" as const;

                data.info.level = island.forest?.level ?? 0;
                data.info.workers = island.forest?.workers ?? 0;
                data.info.constructed_at = island.forestConstructedAt;

                next = await prisma.forest.findFirst({
                    where: { level: (island.forest?.level ?? 0) + 1 },
                });
            } else {
                // Mine
                donations = island.donations;
                workersKey = "worker_mine";
                donatedKey = "donatedMine" as const;

                data.info.level = island.mine?.level ?? 0;
                data.info.workers = island.mine?.workers ?? 0;
                data.info.constructed_at = island.mineConstructedAt;

                next = await prisma.mine.findFirst({
                    where: { level: (island.mine?.level ?? 0) + 1 },
                });
            }

            // Fill extra info
            data.info.donated = (island as any)[donatedKey] ?? 0;
            data.info.required_wood = next?.wood ?? 0;
            data.info.required_time = next?.time ?? 0;

            // Map donations
            data.donations = donations.map(async (cityDonation) => {
                const city = cityDonation.city;

                return {
                    user: city.userCity?.user?.name ?? null,
                    city: city.name,
                    level:
                        city.constructed_at === null
                            ? 0
                            : (await BuildingBL.building(city.id, 1))?.buildingLevel.level,
                    workers: (city.population as any)?.[workersKey] ?? 0,
                    donated: cityDonation.donated,
                };
            });

            return res.json(data);
        } catch (error) {
            console.error("Error in donation:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async setWorker(req: Request, res: Response) {
        try {
            const cityId = parseInt(req.params.id, 10);
            const userId = Number(req.params.userId);
            const { workers, type } = req.body; // type: boolean (true = forest, false = mine)

            // Validate input
            if (typeof workers !== "number" || workers < 0) {
                return res.status(400).json({ error: "workers must be a non-negative number" });
            }
            if (typeof type !== "boolean") {
                return res.status(400).json({ error: "type must be a boolean" });
            }

            // Authorize (replace with your own auth logic)
            // Example: check if city belongs to the logged user
            // const userId = req.user?.id;
            // const userCity = await prisma.userCity.findFirst({ where: { userId, cityId } });
            // if (!userCity) return res.status(403).json({ error: "Forbidden" });

            // Define type of workers
            const targetType = type ? "forest" : "mine";
            const workersKey = type ? "worker_forest" : "worker_mine";

            // Get city population
            const cityPopulation = await prisma.cityPopulation.findUnique({
                where: { cityId: cityId },
            });
            if (!cityPopulation) {
                return res.status(404).json({ error: "City population not found" });
            }

            // Get island of the city
            const islandCity = await prisma.islandCity.findUnique({
                where: { cityId: cityId },
                include: { island: { include: { forest: true, mine: true } } },
            });
            if (!islandCity) {
                return res.status(404).json({ error: "Island city not found" });
            }

            // Check island workers capacity
            const islandWorkers =
                targetType === "forest"
                    ? islandCity.island.forest?.workers ?? 0
                    : islandCity.island.mine?.workers ?? 0;

            if (workers > islandWorkers) {
                return res.status(400).json({
                    error: "You cannot assign more workers than the island allows",
                });
            }

            // Check population satisfaction
            await PopulationBL.satisfaction(userId, cityPopulation);

            // Calculate worker difference
            const currentWorkers = (cityPopulation as any)[workersKey] ?? 0;
            const workersDiff = workers - currentWorkers;

            if (workersDiff > cityPopulation.population) {
                return res.status(400).json({
                    error: "You cannot assign more workers than available citizens",
                });
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

            return res.json({ message: "ok" });
        } catch (error) {
            console.error("Error in setWorker:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // Main entrypoint for donation
    static async setDonation(req: Request, res: Response) {
        try {
            const islandId = parseInt(req.params.id, 10);
            const userId = Number(req.params.userId);
            const { city, wood, type } = req.body; // type: boolean (true = forest, false = mine)

            // Validate input
            if (!city || typeof city !== "number" || city < 1) {
                return res.status(400).json({ error: "city must be an integer >= 1" });
            }
            if (!wood || typeof wood !== "number" || wood < 1) {
                return res.status(400).json({ error: "wood must be an integer >= 1" });
            }
            if (typeof type !== "boolean") {
                return res.status(400).json({ error: "type must be a boolean" });
            }

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            // Verify city belongs to user
            const userCity = await prisma.userCity.findFirst({
                where: { userId: userId, cityId: city },
            });
            if (!userCity) {
                return res.status(400).json({ error: "This city does not exist or does not belong to you" });
            }

            // Verify city is part of the island
            const islandCity = await prisma.islandCity.findFirst({
                where: { islandId: islandId, cityId: city },
            });
            if (!islandCity) {
                return res.status(400).json({ error: "This city is not part of the island you want to donate to" });
            }

            // Dispatch based on type
            if (type) {
                return IslandController.donatedForest(res, islandId, city, wood);
            } else {
                return IslandController.donatedMine(res, islandId, city, wood);
            }
        } catch (error) {
            console.error("Error in setDonation:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // Donate to the forest
    private static async donatedForest(res: Response, islandId: number, cityId: number, wood: number) {
        // Clear expired construction
        await prisma.island.updateMany({
            where: { id: islandId, forestConstructedAt: { lt: new Date() } },
            data: { forestConstructedAt: null },
        });

        const island = await prisma.island.findUnique({
            where: { id: islandId },
            include: { forest: true },
        });

        if (!island) return res.status(404).json({ error: "Island not found" });
        if (island.forestConstructedAt) {
            return res.status(400).json({ error: "Forest is already under construction" });
        }

        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) return res.status(404).json({ error: "City not found" });

        // Update resources of the city
        await CityBL.updateResources(city.id);

        // Check if city has enough wood
        const collect = UnitBL.newCollect();
        collect.wood = wood;

        const hasResources = await CityBL.compareResources(city.id, collect);
        if (!hasResources) {
            return res.status(400).json({ error: "Not enough resources" });
        }

        const nextLevel = await prisma.forest.findFirst({
            where: { level: island.forest.level + 1 },
        });
        if (!nextLevel) {
            return res.status(400).json({ error: "Next forest level not found" });
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

        return res.json({ message: "ok" });
    }

    // Donate to the mine
    private static async donatedMine(res: Response, islandId: number, cityId: number, wood: number) {
        // Clear expired construction
        await prisma.island.updateMany({
            where: { id: islandId, mineConstructedAt: { lt: new Date() } },
            data: { mineConstructedAt: null },
        });

        const island = await prisma.island.findUnique({
            where: { id: islandId },
            include: { mine: true },
        });

        if (!island) return res.status(404).json({ error: "Island not found" });
        if (island.mineConstructedAt) {
            return res.status(400).json({ error: "Mine is already under construction" });
        }

        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) return res.status(404).json({ error: "City not found" });

        // Update resources of the city
        await CityBL.updateResources(city.id);

        // Check if city has enough wood
        const collect = UnitBL.newCollect();
        collect.wood = wood;

        const hasResources = await CityBL.compareResources(city.id, collect);
        if (!hasResources) {
            return res.status(400).json({ error: "Not enough resources" });
        }

        const nextLevel = await prisma.mine.findFirst({
            where: { level: island.mine.level + 1 },
        });
        if (!nextLevel) {
            return res.status(400).json({ error: "Next mine level not found" });
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

        return res.json({ message: "ok" });
    }
}