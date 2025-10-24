import prisma from "../dataAccess/prisma/prisma";
import { City } from "@shared/types/models";
import { addSeconds } from 'date-fns';
import { PopulationBL } from "./populationBL";

export class BuildingBL {
    // Check if there is at least one constructed building in the city
    static async isConstructed(cityId: number): Promise<boolean> {
        const exists = await prisma.cityBuilding.findFirst({
            where: {
                cityId: cityId,
                constructedAt: { not: null },
            },
        });
        return !!exists;
    }

    // Check if a building exists in the given position for the city
    static async positionExist(cityId: number, position: number): Promise<boolean> {
        const exists = await prisma.cityBuilding.findFirst({
            where: {
                cityId: cityId,
                position: position,
            },
        });
        return !!exists;
    }

    // Check if a city has a building of a specific type (building_id)
    static async buildingExist(cityId: number, buildingId: number): Promise<boolean> {
        const exists = await prisma.cityBuilding.findFirst({
            where: {
                cityId: cityId,
                buildingLevel: {
                    is: {
                        buildingId: buildingId,
                    },
                },
            },
        });
        return !!exists;
    }

    // Get the building object for a specific building type (building_id) in the city
    static async building(cityId: number, buildingId: number) {
        const building = await prisma.cityBuilding.findFirst({
            where: {
                cityId: cityId,
                buildingLevel: {
                    is: {
                        buildingId: buildingId,
                    },
                },
            },
            include: {
                buildingLevel: true, // Include building levels if you need details
            },
        });
        return building;
    }

    // Update buildings that have finished construction
    static async updateConstructedTime(cities: number[] | number, type = 0) {
        // If only one city is passed, wrap it in an array
        if (type === 0 && typeof cities === 'number') {
            cities = [cities];
        }

        const cityIds = Array.isArray(cities) ? cities : [cities];

        const cityBuildings = await prisma.cityBuilding.findMany({
            where: {
                cityId: { in: cityIds },
                constructedAt: { lt: addSeconds(new Date(), 3) },
            },
            include: {
                buildingLevel: true,
                city: { include: { userCities: true } },
            },
        });

        for (const cityBuilding of cityBuildings) {
            // Current level
            const after = cityBuilding.buildingLevel;

            // Next level (building_id + 1 level)
            const before = await prisma.buildingLevel.findFirst({
                where: {
                    buildingId: after.buildingId,
                    level: after.level + 1,
                },
            });

            if (!before) continue;

            // Upgrade building
            await prisma.cityBuilding.update({
                where: { id: cityBuilding.id },
                data: {
                    buildingLevelId: before.id,
                    constructedAt: null,
                },
            });

            // Create notification (Mayor equivalent)
            await prisma.mayor.create({
                data: {
                    cityId: cityBuilding.city.id,
                    type: 1,
                    readed: 0,
                    data: JSON.stringify({
                        building_id: after.buildingId,
                        level: before.level,
                    }),
                },
            });

            await PopulationBL.setPopulationMax(cityBuilding.city.id, before.level, cityBuilding.buildingLevel.buildingId);

            // TODO: event(new UserNotification(...)) -> emit socket or push notification
        }
    }

    // Check if a building requires research
    static async checkResearch(authId: number, buildingId: number): Promise<boolean> {
        const researchBuilding = await prisma.researchBuilding.findFirst({
            where: { buildingId },
        });

        if (researchBuilding) {
            const userId = authId;
            const exists = await prisma.userResearch.findFirst({
                where: { userId, researchId: researchBuilding.researchId },
            });

            if (!exists) return false;
        }

        return true;
    }

    // Apply building cost reduction modifier
    static async lessBuildingCost(cityId: number, buildingLevelId: number) {
        const city = await prisma.city.findUnique({ where: { id: cityId } });
        const buildingLevel = await prisma.buildingLevel.findUnique({ where: { id: buildingLevelId } });

        if (city && buildingLevel) {
            // BuildingModifierHelper.lessCost(city, buildingLevel);//TODO HELPER
        }
    }

    // Check if research reduces cost
    static async lessCostResearch(authId: number): Promise<number> {
        const researchNames = ['Pulley', 'Geometry', 'Spirit Level'];

        const researches = await prisma.research.findMany({
            where: { name: { in: researchNames } },
            select: { id: true, name: true },
        });

        const userResearchs = await prisma.userResearch.findMany({
            where: {
                userId: authId,
                researchId: { in: researches.map(r => r.id) },
            },
            include: { research: true },
        });

        if (userResearchs.length > 0) {
            const totalDiscount = userResearchs
                .map(ur => {
                    switch (ur.research.name) {
                        case 'Pulley':
                            return 0.02;
                        case 'Geometry':
                            return 0.04;
                        case 'Spirit Level':
                            return 0.08;
                        default:
                            return 0;
                    }
                })
                .reduce((acc, val) => acc + val, 0 as number);

            return totalDiscount;
        }

        return 0;
    }
}