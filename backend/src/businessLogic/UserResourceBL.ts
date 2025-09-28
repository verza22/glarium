import prisma from "../dataAccess/prisma/prisma";
import { PopulationBL } from "./populationBL";
import { UnitBL } from "./unitBL";

export class UserResourceBL {
    // Update user resources: gold and research points
    public static async updateResources(userId: number) {
        const userResource = await prisma.userResource.findFirst({
            where: { userId },
        });

        if (!userResource) return;

        const diffTime = (Date.now() - userResource.updatedAt.getTime()) / 1000 / 3600; // hours

        await this.updateGold(userResource, userId, diffTime);
        await this.updateResearchPoint(userId, userResource, userId, diffTime);

        await prisma.userResource.update({
            where: { id: userResource.id },
            data: { gold: userResource.gold, researchPoint: userResource.researchPoint, updatedAt: new Date() },
        });
    }

    private static async updateGold(userResource: any, userId: number, diffTime: number) {
        // Get all city IDs of the user
        const userCities = await prisma.userCity.findMany({
            where: { userId },
            select: { cityId: true },
        });

        const cityIds = userCities.map(c => c.cityId);

        // Sum total population
        const cityPopulations = await prisma.cityPopulation.findMany({
            where: { cityId: { in: cityIds } },
        });

        const totalPopulation = cityPopulations.reduce((sum, c) => sum + c.population, 0);

        let goldProduction = 0;
        if (totalPopulation > 0) {
            const citizenGold = 3;
            goldProduction = citizenGold * totalPopulation;
            userResource.gold += goldProduction * diffTime;
        }

        // Calculate gold consumption by units
        const regiments = await prisma.regiment.findMany({
            where: { userId },
            include: { regimentsUnits: { include: { unit: true } } },
        });

        let unitsConsume = 0;
        for (const regiment of regiments) {
            await UnitBL.checkConstructedTime(regiment.id, regiment.userId); // check constructed units
            unitsConsume += regiment.regimentsUnits.reduce((sum, ru) => {
                const consume = ru.cant * ru.unit.gold;
                return sum + (regiment.travel ? consume * 2 : consume);
            }, 0);
        }

        // Gold consumption by scientists
        const letterChuteResearch = await prisma.research.findFirst({ where: { name: 'Letter Chute' }, select: { id: true } });
        const hasLetterChute = letterChuteResearch
            ? await prisma.userResearch.findFirst({ where: { userId, researchId: letterChuteResearch.id } })
            : false;

        const scientistsGold = hasLetterChute ? 3 : 6;
        const totalScientists = cityPopulations.reduce((sum, c) => sum + c.scientists, 0);
        const scientistsConsume = scientistsGold * totalScientists;

        const goldConsume = unitsConsume + scientistsConsume;

        userResource.gold -= goldConsume * diffTime;

        if (userResource.gold < 0) {
            userResource.gold = 0;

            // Remove all scientists
            await prisma.cityPopulation.updateMany({
                where: { cityId: { in: cityIds } },
                data: { scientists: 0 },
            });

            // Remove units if consumption > production
            if (unitsConsume > goldProduction) {
                await UnitBL.removeUnitFromGoldConsume(unitsConsume, goldProduction, userId);
            }
        }
    }

    private static async updateResearchPoint(authId: number, userResource: any, userId: number, diffTime: number) {
        const userCities = await prisma.userCity.findMany({
            where: { userId: userId },
            include: { city: true }
        });

        const cityIds = userCities.map(c => c.cityId);

        const cityPopulations = await prisma.cityPopulation.findMany({
            where: { cityId: { in: cityIds } },
            include: { city: { include: { userCities: true } } },
        });

        let totalScientists = 0;
        for (const cp of cityPopulations) {
            if (cp.city.userCities.find(c => c.capital && c.cityId === cp.cityId)) {
                totalScientists += cp.scientists;
            } else {
                const corruption = 1 - (await PopulationBL.getCorruption(authId, cp.city.id));
                totalScientists += corruption === 1 ? cp.scientists : cp.scientists * corruption;
            }
        }

        if (totalScientists > 0) {
            let pi = totalScientists; // base PI per scientist
            const researchNames = ['Paper', 'Ink', 'Mechanical Pen'];
            const researchIds = (await prisma.research.findMany({ where: { name: { in: researchNames } }, select: { id: true } })).map(r => r.id);

            const userResearches = await prisma.userResearch.findMany({ where: { userId, researchId: { in: researchIds } }, include: { research: true } });
            if (userResearches.length > 0) {
                const researchBonus = 1 + userResearches.reduce((sum, ur) => {
                    switch (ur.research.name) {
                        case 'Paper': return sum + 0.02;
                        case 'Ink': return sum + 0.04;
                        case 'Mechanical Pen': return sum + 0.08;
                        default: return sum;
                    }
                }, 0);
                pi *= researchBonus;
            }

            userResource.researchPoint += pi * diffTime;
        }
    }
}