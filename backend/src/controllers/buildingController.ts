import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { CityBL } from './../businessLogic/cityBL';
import { BuildingBL } from './../businessLogic/buildingBL';
import dayjs from 'dayjs';

export class WorldController {

    public static async buildings(req: Request, res: Response): Promise<void> {
        try {
            // Get the player's cities
            const userId = Number(req.params.userId);
            const cities = await CityBL.myCities(userId);

            // Update construction time for the buildings of the cities
            await BuildingBL.updateConstructedTime(cities, 1);

            // Get city buildings that belong to the player's cities
            const buildings = await prisma.cityBuilding.findMany({
                where: {
                    cityId: { in: cities.map((c: any) => c.id) },
                },
                include: {
                    buildingLevel: true, // relation with building_level
                },
            });

            // Map the buildings to return the required structure
            const result = buildings.map((building) => ({
                id: building.id,
                city_id: building.cityId,
                position: building.position,
                building_id: building.buildingLevel.buildingId,
                level: building.buildingLevel.level,
                constructed_at: building.constructedAt,
            }));

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public static async buildingsAvailable(req: Request, res: Response): Promise<void> {
        try {
            // Validate position param
            const position = parseInt(req.body.position, 10);
            const userId = Number(req.params.userId);

            if (isNaN(position) || position < 1 || position > 15) {
                res.status(400).json({ message: "Position must be between 1 and 15" });
                return;
            }

            const cityId = parseInt(req.params.cityId, 10); // assuming :cityId comes from route
            const city = await prisma.city.findUnique({
                where: { id: cityId },
                include: {
                    userCities: true,
                    islandCity: { include: { island: true } },
                },
            });

            if (!city) {
                res.status(404).json({ message: "City not found" });
                return;
            }

            // Get researched technologies of the user
            const researchedIds = await prisma.userResearch.findMany({
                where: { userId },
                select: { researchId: true },
            });
            const researchIds = researchedIds.map((r) => r.researchId);

            // Get constructed buildings in the city
            const cityBuildings = await prisma.cityBuilding.findMany({
                where: { cityId: city.id },
                include: { buildingLevel: true },
            });
            const builtBuildingIds = cityBuildings.map((b) => b.buildingLevel.buildingId);

            // Buildings that require research not yet completed
            const researchBuildings = await prisma.researchBuilding.findMany({
                where: {
                    researchId: { notIn: researchIds },
                },
                select: { buildingId: true, researchId: true },
            });
            const lockedBuildingIds = researchBuildings.map((rb) => rb.buildingId);

            // Base query for available buildings
            let availableBuildings = await prisma.building.findMany({
                where: {
                    id: { notIn: [...lockedBuildingIds, ...builtBuildingIds] },
                },
            });

            // Base query for buildings pending research
            let researchBuildingsFiltered = await prisma.researchBuilding.findMany({
                where: {
                    researchId: { notIn: researchIds },
                    buildingId: { notIn: builtBuildingIds },
                },
                include: { building: true },
            });

            // Check if city is capital
            if (city.userCities[0]?.capital === true) {
                availableBuildings = availableBuildings.filter((b) => b.id !== 18);
                researchBuildingsFiltered = researchBuildingsFiltered.filter((rb) => rb.buildingId !== 18);
            } else {
                availableBuildings = availableBuildings.filter((b) => b.id !== 17);
                researchBuildingsFiltered = researchBuildingsFiltered.filter((rb) => rb.buildingId !== 17);
            }

            // Filter buildings depending on island type
            let type = city.islandCity?.island.type;
            type = type === undefined ? 0 : type;

            const restrictions: Record<number, number[]> = {
                1: [12, 13, 15],
                2: [12, 13, 14],
                3: [13, 14, 15],
                4: [12, 14, 15],
            };
            const restrictedIds = restrictions[type] || [];
            availableBuildings = availableBuildings.filter((b) => !restrictedIds.includes(b.id));
            researchBuildingsFiltered = researchBuildingsFiltered.filter(
                (rb) => !restrictedIds.includes(rb.buildingId)
            );

            // Filter buildings depending on position
            switch (position) {
                case 13:
                    availableBuildings = availableBuildings.filter((b) => b.id === 19);
                    researchBuildingsFiltered = researchBuildingsFiltered.filter((rb) => rb.buildingId === 19);
                    break;
                case 14:
                    availableBuildings = availableBuildings.filter((b) => b.id === 16);
                    researchBuildingsFiltered = researchBuildingsFiltered.filter((rb) => rb.buildingId === 16);
                    break;
                default:
                    availableBuildings = availableBuildings.filter((b) => ![16, 19].includes(b.id));
                    break;
            }

            // Map available buildings
            const availableResult = await Promise.all(
                availableBuildings.map(async (b) => {
                    const buildingLevel = await prisma.buildingLevel.findFirst({
                        where: { buildingId: b.id, level: 1 },
                    });
                    return {
                        id: b.id,
                        wood: buildingLevel?.wood ?? 0,
                        wine: buildingLevel?.wine ?? 0,
                        marble: buildingLevel?.marble ?? 0,
                        glass: buildingLevel?.glass ?? 0,
                        sulfur: buildingLevel?.sulfur ?? 0,
                        time: buildingLevel?.time ?? 0,
                        research: true,
                    };
                })
            );

            // Map research buildings
            const researchResult = await Promise.all(
                researchBuildingsFiltered.map(async (rb) => {
                    const buildingLevel = await prisma.buildingLevel.findFirst({
                        where: { buildingId: rb.buildingId, level: 1 },
                    });
                    return {
                        id: rb.building.id,
                        wood: buildingLevel?.wood ?? 0,
                        wine: buildingLevel?.wine ?? 0,
                        marble: buildingLevel?.marble ?? 0,
                        glass: buildingLevel?.glass ?? 0,
                        sulfur: buildingLevel?.sulfur ?? 0,
                        time: buildingLevel?.time ?? 0,
                        research: false,
                        research_id: rb.researchId,
                    };
                })
            );

            const buildings = [...researchResult, ...availableResult];
            res.json(buildings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public static async create(req: Request, res: Response): Promise<void> {
        try {
            const cityId = parseInt(req.params.cityId, 10);
            const userId = Number(req.params.userId);
            const { position, building } = req.body;

            // Authorization: check if the city belongs to the user
            const city = await prisma.city.findUnique({
                where: { id: cityId },
                include: {
                    islandCity: { include: { island: true } },
                    userCities: true,
                },
            });

            if (!city) {
                res.status(404).json({ message: "City not found" });
                return;
            }

            if (city.userCities[0].userId !== userId) {
                res.status(403).json({ message: "You do not own this city" });
                return;
            }

            // Validate input
            if (
                !position ||
                isNaN(position) ||
                position < 1 ||
                position > 15 ||
                !building ||
                isNaN(building)
            ) {
                res.status(400).json({ message: "Invalid position or building" });
                return;
            }

            // Get next level and zero level
            const nextLevel = await prisma.buildingLevel.findFirst({
                where: { buildingId: building, level: 1 },
            });
            const zeroLevel = await prisma.buildingLevel.findFirst({
                where: { buildingId: building, level: 0 },
            });

            if (!nextLevel) {
                res.status(400).json({ message: "This building does not exist" });
                return;
            }

            // Check research requirements
            const hasResearch = await BuildingBL.checkResearch(userId, building);
            if (!hasResearch) {
                res.status(400).json({ message: "You do not have the research required to build this building" });
                return;
            }

            // Update construction times for the city
            await BuildingBL.updateConstructedTime(city.id);

            // Check if city is already constructing something
            const isConstructing = await BuildingBL.isConstructed(city.id);
            if (isConstructing) {
                res.status(400).json({ message: "You are already constructing a building in this city" });
                return;
            }

            // Check if position already has a building
            const posExists = await BuildingBL.positionExist(city.id, position);
            if (posExists) {
                res.status(400).json({ message: "There is already a building in this position" });
                return;
            }

            // Check if the building already exists in another position
            const buildingExists = await BuildingBL.buildingExist(city.id, building);
            if (buildingExists) {
                res.status(400).json({ message: "This building already exists in another position" });
                return;
            }

            // Validate resource-production buildings depending on island type
            if (building >= 12 && building <= 18) {
                const islandType = city.islandCity?.island.type;
                const userCity = await prisma.userCity.findFirst({
                    where: { userId: userId, cityId: city.id }
                });

                switch (building) {
                    case 12: // Glass Blower
                        if (islandType !== 3) {
                            res.status(400).json({ message: "You cannot build this on this island type" });
                            return;
                        }
                        break;
                    case 13: // Alchemist Tower
                        if (islandType !== 4) {
                            res.status(400).json({ message: "You cannot build this on this island type" });
                            return;
                        }
                        break;
                    case 14: // Vineyard
                        if (islandType !== 1) {
                            res.status(400).json({ message: "You cannot build this on this island type" });
                            return;
                        }
                        break;
                    case 15: // Stonemason
                        if (islandType !== 2) {
                            res.status(400).json({ message: "You cannot build this on this island type" });
                            return;
                        }
                        break;
                    case 17: // Palace
                        if (userCity?.capital !== true) {
                            res.status(400).json({ message: "You can only build this in the capital" });
                            return;
                        }
                        break;
                    case 18: // Governor's Residence
                        if (userCity?.capital !== false) {
                            res.status(400).json({ message: "You can only build this in colonies" });
                            return;
                        }
                        break;
                }
            }

            // Apply discounts from researches or buildings
            await BuildingBL.lessBuildingCost(city.id, nextLevel.level);

            // Compare resources
            const hasResources = await CityBL.compareResources(city.id, nextLevel);
            if (!hasResources) {
                res.status(400).json({ message: "You do not have enough resources" });
                return;
            }

            // Remove resources
            await CityBL.removeResources(city.id, nextLevel);

            // Create the city building
            await prisma.cityBuilding.create({
                data: {
                    cityId: city.id,
                    position: position,
                    buildingLevelId: zeroLevel!.id,
                    constructedAt: dayjs().add(nextLevel.time, "second").toDate(),
                },
            });

            res.json({ message: "ok" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public static async nextLevel(req: Request, res: Response): Promise<void> {
        try {
            const buildingId = parseInt(req.params.buildingId, 10);
            const { level } = req.body;

            if (!level || isNaN(level) || level < 1) {
                res.status(400).json({ message: "Level must be an integer >= 1" });
                return;
            }

            // Get next building level
            let nextLevel = await prisma.buildingLevel.findFirst({
                where: { buildingId, level: level + 1 },
            });

            let maximum = false;

            if (!nextLevel) {
                // If no next level, return the current level and mark as maximum
                nextLevel = await prisma.buildingLevel.findFirst({
                    where: { buildingId, level },
                });
                maximum = true;
            }

            if (!nextLevel) {
                res.status(404).json({ message: "Building level not found" });
                return;
            }

            const result: any = { ...nextLevel, maximum };

            // If building is Barracks (id = 4), attach units data
            if (buildingId === 4) {
                const units = await prisma.unit.findMany({
                    select: {
                        id: true,
                        population: true,
                        wood: true,
                        wine: true,
                        glass: true,
                        sulfur: true,
                        time: true,
                        barrackLevel: true,
                        gold: true,
                    },
                });

                // Add trainer: 0 (default value, not persisted in DB)
                result.units = units.map((u) => ({ ...u, trainer: 0 }));
            }

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    public static async upgrade(req: Request, res: Response): Promise<void> {
        try {
            const cityBuildingId = parseInt(req.params.cityBuildingId, 10);
            const userId = Number(req.params.userId);

            const cityBuilding = await prisma.cityBuilding.findUnique({
                where: { id: cityBuildingId },
                include: {
                    buildingLevel: true,
                    city: {
                        include: {
                            userCities: true,
                            islandCity: { include: { island: true } },
                        },
                    },
                },
            });

            if (!cityBuilding) {
                res.status(404).json({ message: "CityBuilding not found" });
                return;
            }

            // Authorization: check if the city belongs to the user
            if (cityBuilding.city.userCities[0].userId !== userId) {
                res.status(403).json({ message: "You do not own this city" });
                return;
            }

            const nowLevel = cityBuilding.buildingLevel;
            const nextLevel = await prisma.buildingLevel.findFirst({
                where: {
                    buildingId: nowLevel.buildingId,
                    level: nowLevel.level + 1,
                },
            });

            if (!nextLevel) {
                res.status(400).json({ message: "This building level does not exist" });
                return;
            }

            // Update construction times
            await BuildingBL.updateConstructedTime(cityBuilding.cityId);

            // Check if something is already under construction
            const isConstructing = await BuildingBL.isConstructed(cityBuilding.cityId);
            if (isConstructing) {
                res.status(400).json({ message: "You are already constructing something in this city" });
                return;
            }

            // Apply research/building discounts
            await BuildingBL.lessBuildingCost(cityBuilding.cityId, nextLevel.level);

            // Check resources
            const hasResources = await CityBL.compareResources(cityBuilding.cityId, nextLevel);
            if (!hasResources) {
                res.status(400).json({ message: "You do not have enough resources" });
                return;
            }

            // Remove resources
            await CityBL.removeResources(cityBuilding.cityId, nextLevel);

            // Update building construction time (not immediately upgrade level)
            await prisma.cityBuilding.update({
                where: { id: cityBuilding.id },
                data: {
                    constructedAt: dayjs().add(nextLevel.time, "second").toDate(),
                },
            });

            res.json({ message: "ok" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}