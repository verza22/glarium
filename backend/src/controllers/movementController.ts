import { Request, Response } from 'express';
import { world } from '../config/world';
import prisma from '../dataAccess/prisma/prisma'
import { MovementBL } from './../businessLogic/movementBL';
import { UnitBL } from './../businessLogic/unitBL';
import { CityBL } from './../businessLogic/cityBL';
import dayjs from "dayjs";
import { BuildingBL } from './../businessLogic/buildingBL';
import { UserResourceBL } from './../businessLogic/userResourceBL';
import { PopulationBL } from './../businessLogic/populationBL';
import { UserBL } from './../businessLogic/userBL';

export class MovementController {
    static async transport(req: Request, res: Response) {
        const userId = Number(req.params.userId);
        const cityId = Number(req.params.cityId);
        const cityToId = Number(req.params.cityToId);
        const userCity = await prisma.userCity.findFirstOrThrow({ where: { userId: userId, cityId: cityId }, include: { city: true } });

        // Validate request
        const { wood = 0, wine = 0, marble = 0, glass = 0, sulfur = 0 } = req.body;
        if (cityToId === undefined || cityToId < 0) return res.status(400).send('Invalid city_to');

        // Return movements
        // MovementHelper.returnMovementResources(city);

        const city = userCity.city;

        // Check action points
        const apoint = await MovementBL.getActionPoint(city.id, userId);
        if (apoint >= city.apoint) return res.send('You reached the max action points of the city');

        // Verify destination city exists
        const userCityTo = await prisma.userCity.findFirstOrThrow({ where: { userId: userId, cityId: cityToId }, include: { city: true } });

        const cityTo = userCityTo.city;

        // Verify cities are different
        if (city.id === cityTo.id) return res.send('You cannot send a movement to the same origin city');

        // Verify at least one merchant available
        const userResource = await prisma.userResource.findFirst({ where: { userId } });
        if (!userResource || userResource.tradeShipAvailable < 1)
            return res.send('No merchants available');

        const collect = UnitBL.newCollect();
        collect.wood += wood;
        collect.wine += wine;
        collect.marble += marble;
        collect.glass += glass;
        collect.sulfur += sulfur;

        // Verify the city has the resources
        if (!CityBL.compareResources(city.id, collect)) return res.send('Not enough resources');

        const total = collect.wood + collect.wine + collect.marble + collect.glass + collect.sulfur;

        // Verify capacity is not zero
        if (total === 0) return res.send('You must transport some resources');

        // Verify ship capacity
        const maxCapacity = world.transport * userResource.tradeShipAvailable;
        if (total > maxCapacity)
            return res.send('Cannot transport more than max capacity, buy more merchants');

        const usedShips = Math.ceil(total / world.transport);

        const loadedTime = await MovementBL.loadedSpeed(city.id, total);
        const transportTime = await MovementBL.distanceTime(city.id, cityTo.id);

        const startAt = dayjs().add(loadedTime, 'second').toDate();
        const endAt = dayjs().add(loadedTime + transportTime, 'second').toDate();
        let returnAt;
        const userCities = await prisma.userCity.findMany({ where: { userId }, select: { cityId: true } });
        const cityIds = userCities.map(c => c.cityId);
        if (cityIds.includes(cityTo.id)) {
            returnAt = endAt;
        } else {
            returnAt = dayjs().add(loadedTime + transportTime * 2, 'second').toDate();
        }

        // Remove resources
        await CityBL.removeResources(city.id, collect);

        // Create movement
        const movement = await prisma.movement.create({
            data: {
                startAt,
                endAt,
                returnAt,
                userId,
                cityFromId: city.id,
                cityToId: cityTo.id,
                movementTypeId: 1,
                tradeShip: usedShips,
                delivered: false,
                cancelled: false
            }
        });

        // Create movement resources
        await prisma.movementResource.create({
            data: {
                movementId: movement.id,
                wood: collect.wood,
                wine: collect.wine,
                marble: collect.marble,
                glass: collect.glass,
                sulfur: collect.sulfur,
            }
        });

        // Remove merchant ships
        await prisma.userResource.update({ where: { id: userResource.id }, data: { tradeShipAvailable: userResource.tradeShipAvailable - usedShips } });

        // Notify destination general
        // UserNotification.dispatch('advisors', 'general', cityTo.userCity.userId);

        return res.send('ok');
    }

    static async fromUpdate(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);
        const userCity = await prisma.userCity.findFirstOrThrow({ where: { cityId, userId } });

        if (!userCity) return res.status(404).send('City not found');

        // Return movement resources
        await MovementBL.returnMovementResources(cityId);

        return res.send('ok');
    }

    static async toUpdate(req: Request, res: Response) {
        const cityId = Number(req.params.cityId);
        const userId = Number(req.params.userId);
        const userCity = await prisma.userCity.findFirstOrThrow({ where: { cityId, userId } });

        if (!userCity) return res.status(404).send('City not found');

        // Deliver resources to city
        await MovementBL.deliveredResourcesTo([cityId]);

        return res.send('ok');
    }

    static async colonize(req: Request, res: Response) {
        const userId = Number(req.params.userId);
        const cityId = Number(req.params.cityId);

        const { island, position } = req.body;

        if (!island || !position || position < 1 || position > 16) {
            return res.status(400).send("Invalid island or position");
        }

        const userCity = await prisma.userCity.findFirstOrThrow({ where: { userId: userId, cityId: cityId }, include: { city: { include: { population: true } } } });
        const city = userCity.city;

        // Get capital
        const capital = await prisma.userCity.findFirstOrThrow({
            where: { userId, capital: true }
        });

        // Validate palace existence
        if (!(await BuildingBL.buildingExist(capital.cityId, 17))) {
            return res.send("You don't have a palace");
        }

        const cityBuilding = await BuildingBL.building(capital.cityId, 17);
        let palaceLevel = cityBuilding?.buildingLevel.level;
        if (palaceLevel === undefined)
            palaceLevel = 0;

        // Validate colonization limit
        const userCitiesCount = await prisma.userCity.count({ where: { userId } });
        if (userCitiesCount > palaceLevel) {
            return res.send("You must upgrade your palace to colonize another city");
        }

        // Return merchants
        await MovementBL.returnMovementResources(city.id);

        // Validate merchants available
        const userResource = await prisma.userResource.findFirst({ where: { userId } });
        if (!userResource) return res.status(400).send("Resources not found");

        if (userResource.tradeShipAvailable < 3) {
            return res.send("You don't have enough trade ships available");
        }

        // Update resources
        await UserResourceBL.updateResources(userId);

        // Validate gold
        if (userResource.gold < world.colonize.gold) {
            return res.send("You don't have enough gold to colonize");
        }

        if (!city.population)
            return res.send("Error city population not found");

        // Population satisfaction check
        await PopulationBL.satisfaction(userId, city.population);

        const collect = UnitBL.newCollect();
        collect.wood = world.colonize.wood;
        collect.population = world.colonize.population;

        // Validate population
        if (!(await PopulationBL.comparePopulation(city, collect))) {
            return res.send("You don't have enough citizens to colonize");
        }

        // Validate wood
        if (city.wood < collect.wood) {
            return res.send("You don't have enough wood to colonize");
        }

        // Validate action points
        const apoint = await MovementBL.getActionPoint(city.id, userId);
        if (apoint >= city.apoint) {
            return res.send("You reached the maximum action points for this city");
        }

        // Check island position availability
        const targetIsland = await prisma.island.findUniqueOrThrow({ where: { id: island }, include: { islandCity: true } });
        if (!targetIsland) return res.status(404).send("Island not found");

        const isOccupied = targetIsland.islandCity.some(
            (c: any) => c.position === position
        );
        if (isOccupied) {
            return res.send("There is already a city in this position");
        }

        // Calculate times
        const loadedTime = await MovementBL.loadedSpeed(city.id, 1250);
        const transportTime = await MovementBL.distanceTimeColonize(
            city.id,
            targetIsland.id
        );

        const startAt = dayjs().add(loadedTime, "second").toDate();
        const endAt = dayjs()
            .add(transportTime + loadedTime, "second")
            .toDate();

        // Remove resources
        await CityBL.removeResources(city.id, collect);
        await PopulationBL.removePopulation(city.id, collect);


        await prisma.userResource.update({
            where: { id: userResource.id },
            data: { gold: userResource.gold - world.colonize.gold, tradeShipAvailable: userResource.tradeShipAvailable - 3 },
        });

        // Create new city
        const cityTo = await CityBL.createCity(userId, targetIsland.id, position);

        // Create movement
        await prisma.movement.create({
            data: {
                startAt,
                endAt,
                userId,
                cityFromId: city.id,
                cityToId: cityTo,
                movementTypeId: 4,
                tradeShip: 3,
                delivered: false,
                cancelled: false
            }
        });

        return res.send("ok");
    }


    static async getMovement(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId);

            await MovementBL.returnMovementResourcesAll(userId);

            const cities = await prisma.userCity.findMany({ where: { userId: userId } });
            const cityIds = cities.map(c => c.id);

            // 3. Fetch all relevant movements with Prisma
            const movements = await prisma.movement.findMany({
                where: {
                    OR: [
                        { userId: userId },
                        { cityToId: { in: cityIds } }
                    ]
                },
                include: {
                    resources: true,
                    movementRegiments: {
                        include: {
                            regiment: {
                                include: { regimentsUnits: true }
                            }
                        }
                    },
                    cityTo: {
                        include: { userCities: { include: { user: true } } }
                    },
                    cityFrom: {
                        include: { userCities: { include: { user: true } } }
                    }
                }
            });

            // 4. Map results to structured response
            const data = movements
                .map(movement => {
                    // Skip delivered movements going to user's city (except colonization)
                    if (
                        cityIds.includes(movement.cityTo.id) &&
                        movement.movementTypeId !== 4 &&
                        movement.delivered === true
                    ) {
                        return null;
                    }

                    const result: any = {
                        id: movement.id,
                        start_at: movement.startAt,
                        end_at: movement.endAt,
                        return_at: movement.returnAt,
                        delivered: movement.delivered,
                        user_id: movement.userId,
                        movementTypeId: movement.movementTypeId,
                        trade_ship: movement.tradeShip,
                        resources: {},
                        city_to: {
                            id: movement.cityTo.id,
                            name: movement.cityTo.name,
                            user: movement.cityTo.userCities[0].user.name
                        },
                        city_from: {
                            id: movement.cityFrom.id,
                            name: movement.cityFrom.name,
                            user: movement.cityFrom.userCities[0].user.name
                        }
                    };

                    // Add resources if available
                    if (movement.resources) {
                        result.resources = {
                            wood: movement.resources.wood,
                            wine: movement.resources.wine,
                            marble: movement.resources.marble,
                            glass: movement.resources.glass,
                            sulfur: movement.resources.sulfur
                        };
                    }

                    // Add units for attack/defense
                    if (movement.movementTypeId === 2 || movement.movementTypeId === 3) {
                        result.resources.units = movement.movementRegiments[0].regiment.regimentsUnits.map(u => ({
                            unit_id: u.unitId,
                            cant: u.cant
                        }));
                    }

                    // Add colonization resources
                    if (movement.movementTypeId === 4) {
                        result.resources.wood = world.colonize.wood;
                        result.resources.gold = world.colonize.gold;
                    }

                    return result;
                })
                .filter(m => m !== null);

            return res.json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching movements" });
        }
    }

    static async removeMovement(req: Request, res: Response) {
        try {
            const movementId = req.params.id;
            const userId = Number(req.params.userId);

            // 1. Fetch the movement including related data
            const movement = await prisma.movement.findUnique({
                where: { id: Number(movementId) },
                include: {
                    resources: true,
                    cityFrom: { include: { population: true } },
                    cityTo: true
                }
            });

            if (!movement) return res.status(404).json({ message: "Movement not found" });

            // 2. Check ownership
            if (movement.userId !== userId) {
                return res.status(403).json({ message: "You cannot cancel movements that do not belong to you" });
            }

            const now = new Date();

            // 3. Cancel movement that is still loading (start_at in the future)
            if (movement.startAt && movement.startAt > now) {
                // Restore user's available trade ships
                const userResource = await prisma.userResource.findUniqueOrThrow({ where: { userId: userId } });
                await prisma.userResource.update({
                    where: { userId: userId },
                    data: { tradeShipAvailable: userResource.tradeShipAvailable + movement.tradeShip }
                });

                switch (movement.movementTypeId) {
                    case 1:
                        // Return resources to origin city
                        if (movement.resources) {
                            await CityBL.addResources(movement.cityFromId, movement.resources);
                        }
                        break;
                    case 4:
                        // Colonization rollback
                        const collect = UnitBL.newCollect();
                        collect.wood = world.colonize.wood;
                        await CityBL.addResources(movement.cityFromId, collect);

                        await prisma.userResource.update({
                            where: { userId: userId },
                            data: { gold: { increment: world.colonize.gold } }
                        });

                        if (movement.cityFrom.population) {
                            await prisma.cityPopulation.update({
                                where: { id: movement.cityFrom.population.id },
                                data: { population: movement.cityFrom.population.population + world.colonize.population }
                            });
                        }


                        // Delete the colonized city
                        await prisma.city.delete({ where: { id: movement.cityToId } });
                        break;
                }

                // Delete the movement
                await prisma.movement.delete({ where: { id: movement.id } });
                return res.json({ message: "ok1" });
            }

            // 4. Check if movement has already ended
            if (movement.endAt && movement.endAt < now) {
                return res.status(400).json({ message: "The movement can no longer be cancelled" });
            }

            // 5. Check if already cancelled
            if (movement.cancelled) {
                return res.status(400).json({ message: "The movement was already cancelled" });
            }

            // 6. Cancel ongoing movement
            const seconds = movement.startAt ? Math.floor((movement.startAt.getTime() - now.getTime()) / 1000) : 0;
            await prisma.movement.update({
                where: { id: movement.id },
                data: {
                    endAt: now,
                    returnAt: new Date(now.getTime() + seconds * 1000),
                    cancelled: true,
                    delivered: true
                }
            });

            return res.json({ message: "ok2" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error removing movement" });
        }
    };
}