import { Request, Response } from 'express';
import prisma from '../dataAccess/prisma/prisma'
import { CityBL } from './../businessLogic/cityBL';
import { BuildingBL } from './../businessLogic/buildingBL';
import dayjs from 'dayjs';
import { ResponseBuildingAvailable, ResponseBuildingGetInfo, ResponseBuildingNextLevel } from '@shared/types/responses';
import { RequestBuildingAvailable, RequestBuildingCreate, RequestBuildingGetInfo, RequestBuildingNextLevel, RequestBuildingUpgrade } from '@shared/types/requests';
import { validateFields } from '../utils/validateFields';
import { Resources } from '@shared/types/models';
import { UnitBL } from '../businessLogic/unitBL';

export class BuildingController {

    public async getInfo(req: Request, res: Response): Promise<void> {
        const { cityId }: RequestBuildingGetInfo = validateFields(req, [
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        //check permissions
        const userCities = await prisma.userCity.findMany({ where: { userId, cityId: cityId } });
        if (userCities.length === 0)
            throw new Error("User doesn't have permission for see this city");

        // Update construction time for the buildings of the cities
        await BuildingBL.updateConstructedTime(cityId, 1);

        // Get city buildings that belong to the player's cities
        const buildings = await prisma.cityBuilding.findMany({
            where: {
                cityId: cityId,
            },
            include: {
                buildingLevel: true, // relation with building_level
            },
        });

        // Map the buildings to return the required structure
        const result: ResponseBuildingGetInfo[] = buildings.map((building) => ({
            id: building.id,
            cityId: building.cityId,
            position: building.position,
            buildingId: building.buildingLevel.buildingId,
            level: building.buildingLevel.level,
            constructedAt: building.constructedAt
        }));

        res.json(result);
    }

    public async available(req: Request, res: Response): Promise<void> {
        const { position, cityId }: RequestBuildingAvailable = validateFields(req, [
            { name: "position", type: "number", required: true },
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        if (isNaN(position) || position < 1 || position > 15) {
            throw new Error("Position must be between 1 and 15");
        }

        const city = await prisma.city.findFirst({
            where: { id: cityId },
            include: {
                userCities: true,
                islandCity: { include: { island: true } },
            },
        });

        if (!city) {
            throw new Error("City not found");
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
                    researchId: 0
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
                    researchId: rb.researchId,
                };
            })
        );

        const buildings: ResponseBuildingAvailable[] = [...researchResult, ...availableResult];
        res.json(buildings);
    }

    public async create(req: Request, res: Response): Promise<void> {
        const { position, cityId, buildingId }: RequestBuildingCreate = validateFields(req, [
            { name: "position", type: "number", required: true },
            { name: "cityId", type: "number", required: true },
            { name: "buildingId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        // Authorization: check if the city belongs to the user
        const city = await prisma.city.findUnique({
            where: { id: cityId },
            include: {
                islandCity: { include: { island: true } },
                userCities: true,
            },
        });

        if (!city) {
            throw new Error("City not found");
        }

        if (city.userCities[0].userId !== userId) {
            throw new Error("You do not own this city");
        }

        // Validate input
        if (
            !position ||
            isNaN(position) ||
            position < 1 ||
            position > 15 ||
            !buildingId ||
            isNaN(buildingId)
        ) {
            throw new Error("Invalid position or building");
        }

        // Get next level and zero level
        const nextLevel = await prisma.buildingLevel.findFirst({
            where: { buildingId: buildingId, level: 1 },
        });
        const zeroLevel = await prisma.buildingLevel.findFirst({
            where: { buildingId: buildingId, level: 0 },
        });

        if (!nextLevel) {
            throw new Error("This building does not exist");
        }

        // Check research requirements
        const hasResearch = await BuildingBL.checkResearch(userId, buildingId);
        if (!hasResearch) {
            throw new Error("You do not have the research required to build this building");
        }

        // Update construction times for the city
        await BuildingBL.updateConstructedTime(city.id);

        // Check if city is already constructing something
        const isConstructing = await BuildingBL.isConstructed(city.id);
        if (isConstructing) {
            throw new Error("You are already constructing a building in this city");
        }

        // Check if position already has a building
        const posExists = await BuildingBL.positionExist(city.id, position);
        if (posExists) {
            throw new Error("There is already a building in this position");
        }

        // Check if the building already exists in another position
        const buildingExists = await BuildingBL.buildingExist(city.id, buildingId);
        if (buildingExists) {
            throw new Error("This building already exists in another position");
        }

        // Validate resource-production buildings depending on island type
        if (buildingId >= 12 && buildingId <= 18) {
            const islandType = city.islandCity?.island.type;
            const userCity = await prisma.userCity.findFirst({
                where: { userId: userId, cityId: city.id }
            });

            switch (buildingId) {
                case 12: // Glass Blower
                    if (islandType !== 3) {
                        throw new Error("You cannot build this on this island type");
                    }
                    break;
                case 13: // Alchemist Tower
                    if (islandType !== 4) {
                        throw new Error("You cannot build this on this island type");
                    }
                    break;
                case 14: // Vineyard
                    if (islandType !== 1) {
                        throw new Error("You cannot build this on this island type");
                    }
                    break;
                case 15: // Stonemason
                    if (islandType !== 2) {
                        throw new Error("You cannot build this on this island type");
                    }
                    break;
                case 17: // Palace
                    if (userCity?.capital !== true) {
                        throw new Error("You can only build this in the capital");
                    }
                    break;
                case 18: // Governor's Residence
                    if (userCity?.capital !== false) {
                        throw new Error("You can only build this in colonies");
                    }
                    break;
            }
        }

        // Apply discounts from researches or buildings
        await BuildingBL.lessBuildingCost(city.id, nextLevel.level);

        // Compare resources
        const hasResources = await CityBL.compareResources(city.id, nextLevel);
        if (!hasResources) {
            throw new Error("You do not have enough resources");
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

    public async nextLevel(req: Request, res: Response): Promise<void> {
        const { position, buildingId, cityId }: RequestBuildingNextLevel = validateFields(req, [
            { name: "position", type: "number", required: true },
            { name: "buildingId", type: "number", required: true },
            { name: "cityId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

        // Update construction time for the buildings of the cities
        await BuildingBL.updateConstructedTime(cityId, 1);

        const cityBuilding = await prisma.cityBuilding.findFirstOrThrow({ where: { cityId, position: position }, include: { buildingLevel: true } });
        const level = cityBuilding.buildingLevel.level;

        // Get next building level
        let nextLevel = await prisma.buildingLevel.findFirst({
            where: { buildingId, level: level + 1 }
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
            throw new Error("Building level not found");
        }

        const result: ResponseBuildingNextLevel = { ...nextLevel, maximum, cityBuildingId: cityBuilding.id };

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

        switch(buildingId){
            case 5:
                const cityTavern = await prisma.city.findFirstOrThrow({ where: { id: cityId }, include: { population: true } });
                console.log({
                    wine: cityTavern.population?.wine,
                    wineMax: cityTavern.population?.wineMax
                })
                result.tavern = {
                    wine: cityTavern.population?.wine ? cityTavern.population.wine : 0,
                    wineMax: cityTavern.population?.wineMax ? cityTavern.population.wineMax : 0
                }
            break;
            case 2:
                const cityAcademy = await prisma.city.findFirstOrThrow({ where: { id: cityId }, include: { population: true } });
                result.academy = {
                    scientists: cityAcademy.population?.scientists ? cityAcademy.population.scientists : 0,
                    scientistsMax: cityAcademy.population?.scientistsMax ? cityAcademy.population.scientistsMax : 0,
                }
            break;
            case 4:
                result.barracks = await UnitBL.getData(userId, cityId);
            break;
        }

        res.json(result);
    }

    public async upgrade(req: Request, res: Response): Promise<void> {
        const { cityBuildingId }: RequestBuildingUpgrade = validateFields(req, [
            { name: "cityBuildingId", type: "number", required: true }
        ]);
        const userId = req.authUser.userId;

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
            throw new Error("CityBuilding not found");
        }

        // Authorization: check if the city belongs to the user
        if (cityBuilding.city.userCities[0].userId !== userId) {
            throw new Error("You do not own this city");
        }

        const nowLevel = cityBuilding.buildingLevel;
        const nextLevel = await prisma.buildingLevel.findFirst({
            where: {
                buildingId: nowLevel.buildingId,
                level: nowLevel.level + 1,
            },
        });

        if (!nextLevel) {
            throw new Error("This building level does not exist");
        }

        // Update construction times
        await BuildingBL.updateConstructedTime(cityBuilding.cityId);

        // Check if something is already under construction
        const isConstructing = await BuildingBL.isConstructed(cityBuilding.cityId);
        if (isConstructing) {
            throw new Error("You are already constructing something in this city");
        }

        // Apply research/building discounts
        await BuildingBL.lessBuildingCost(cityBuilding.cityId, nextLevel.level);

        // Check resources
        const hasResources = await CityBL.compareResources(cityBuilding.cityId, nextLevel);
        if (!hasResources) {
            throw new Error("You do not have enough resources");
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

        //get resources
        const cityUpdated = await prisma.city.findUniqueOrThrow({ where: { id: cityBuilding.cityId } });

        const updatedResources: Resources = {
            wood: cityUpdated.wood,
            marble: cityUpdated.marble,
            wine: cityUpdated.wine,
            glass: cityUpdated.glass,
            sulfur: cityUpdated.sulfur
        }

        res.json(updatedResources);
    }
}