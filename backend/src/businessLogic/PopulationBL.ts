import prisma from "../dataAccess/prisma/prisma";
import { Prisma } from "./../dataAccess/prisma/generated/client";
import { UserResourceBL } from "./userResourceBL";
import { world } from "../config";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { City, CityBuilding, CityPopulation } from "@shared/types/models";

dayjs.extend(duration);

export class PopulationBL {
    /**
     * Calculate corruption based on residence level and number of colonies.
     */
    public static async getCorruption(userId: number, cityId: number): Promise<number> {
        // Get residence building level (building_id = 18)
        const cityBuilding = await prisma.cityBuilding.findFirst({
            where: {
                cityId: cityId,
                buildingLevel: { buildingId: 18 },
            },
            include: { buildingLevel: true },
        });

        const level = cityBuilding?.buildingLevel?.level ?? 0;

        // Get number of colonies for the user
        const colonies = await prisma.userCity.count({
            where: { userId: userId, capital: false },
        });

        const corruption = 1 - (level + 1) / (colonies + 1);
        return corruption;
    }

    /**
     * Compare if a city has enough population vs. a required amount.
     */
    public static comparePopulation(city: Prisma.CityGetPayload<{ include: { population: true } }>, collect: { population: number }): boolean {
        if (city.population === null)
            return false

        return city.population.population >= collect.population;
    }

    /**
     * Remove population from a city and update resources.
     */
    public static async removePopulation(cityId: number, collect: { population: number }): Promise<void> {
        const cityPopulation = await prisma.cityPopulation.findFirst({
            where: { cityId: cityId },
            include: { city: { include: { userCities: true } } }
        });
        if (!cityPopulation) return;

        await prisma.cityPopulation.update({
            where: { id: cityPopulation.id },
            data: { population: cityPopulation.population - collect.population },
        });

        await UserResourceBL.updateResources(cityPopulation.city.userCities[0].userId);
    }

    /**
     * Update satisfaction and available citizens for a city.
     */
    public static async satisfaction(authId: number, cityPopulation: Prisma.CityPopulationGetPayload<{}>, updatedResources = true): Promise<void> {
        const now = dayjs();
        const updatedAt = dayjs(cityPopulation.updatedAt);
        const seconds = now.diff(updatedAt, "second");
        const diffTime = seconds / 3600;

        // Check if Tavern exists (building_id = 5)
        const cityBuilding = await prisma.cityBuilding.findFirst({
            where: {
                cityId: cityPopulation.cityId,
                buildingLevel: { buildingId: 5 },
            },
            include: { buildingLevel: true },
        });

        const otherPopulation =
            cityPopulation.workerForest +
            cityPopulation.workerMine +
            cityPopulation.scientists;

        const maxPopulation = cityPopulation.populationMax - otherPopulation;

        let bonuses = 196; // Base bonus

        // Tavern bonuses
        if (cityBuilding) {
            const tavernLevel = cityBuilding.buildingLevel.level;
            const perWine = cityPopulation.wineMax > 0 ? (cityPopulation.wine / cityPopulation.wineMax) : 1;
            const bonusWine = tavernLevel * 60 * perWine;

            bonuses += bonusWine * world.bonus.tavern;
            bonuses += tavernLevel * 12 * world.bonus.tavern;
        }

        // Research bonuses
        const researchIds = await prisma.research.findMany({
            where: { name: { in: ["Holiday", "Well Digging"] } },
            select: { id: true, name: true },
        });

        const userResearchs = await prisma.userResearch.findMany({
            where: {
                userId: authId,
                researchId: { in: researchIds.map((r) => r.id) },
            },
            include: { research: true },
        });

        const userCity = await prisma.userCity.findFirst({
            where: { userId: authId, cityId: cityPopulation.cityId },
        });
        const capital = userCity?.capital ?? 0;

        for (const ur of userResearchs) {
            if (ur.research.name === "Holiday") {
                bonuses += 25;
            } else if (ur.research.name === "Well Digging" && capital === true) {
                bonuses += 50;
            }
        }

        // Base deductions
        let deduction = cityPopulation.population + otherPopulation;

        // Apply corruption if not capital
        if (capital === 0) {
            const corruption = await this.getCorruption(authId, userCity!.id);
            deduction += bonuses * corruption;
        }

        let population = cityPopulation.population;
        
        const diffTimeDecimal = diffTime - Math.floor(diffTime);

        // Integer part of time
        for (let i = 0; i < Math.floor(diffTime); i++) {
            const satisfaction = bonuses - deduction;
            const regeneration = satisfaction * 0.02;
            
            population += regeneration;
            deduction = population + otherPopulation;
            if (population >= bonuses - 0.01) {
                population = bonuses;
                break;
            }
        }

 

        // Decimal part of time
        if (population < bonuses && population < maxPopulation) {
            population += diffTimeDecimal * ((bonuses - deduction) * 0.02);
        }

        if (population + otherPopulation > cityPopulation.populationMax) {
            population = maxPopulation;
        }

        await prisma.cityPopulation.update({
            where: { id: cityPopulation.id },
            data: { population },
        });

        if (updatedResources) {
            await UserResourceBL.updateResources(authId);
        }
    }

    /**
     * Update max population depending on the building.
     */
    public static async setPopulationMax(cityId: number, level: number, buildingId: number): Promise<void> {

        const cityPopulation = await prisma.cityPopulation.findFirst({
            where: { cityId: cityId },
        });
        if (!cityPopulation) return;

        switch (buildingId) {
            case 1: {
                const populationMax = Math.floor((10 * Math.pow(level, 1.5)) * 2 + 40);
                await prisma.cityPopulation.update({
                    where: { id: cityPopulation.id },
                    data: { populationMax },
                });

                await prisma.city.update({
                    where: { id: cityId },
                    data: { apoint: 3 + Math.floor(level / 4) },
                });
                break;
            }
            case 2: {
                const scientistsMax = Math.ceil(7 + Math.pow(level, 1.8));
                await prisma.cityPopulation.update({
                    where: { id: cityPopulation.id },
                    data: { scientistsMax },
                });
                break;
            }
            case 5: {
                await prisma.cityPopulation.update({
                    where: { id: cityPopulation.id },
                    data: { wineMax: level * 12 },
                });
                break;
            }
        }
    }

    public static getAvailablePopulation(cityPopulation: Prisma.CityPopulationGetPayload<{}>): number {
        const { populationMax, workerForest, workerMine, scientists  } = cityPopulation;
        return Math.floor(populationMax - (workerForest + workerMine + scientists));
    }
}