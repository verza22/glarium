
import prisma from "src/dataAccess/prisma/prisma";
import { UserResource } from "@shared/types/models";
import { sumProperty } from "@shared/utils/utils";

class UserBusinessLogic {
    async updateResources()
    {
        const authId = 1;

        const userResource:UserResource = await prisma.userResource.findFirstOrThrow({ where: { userId: authId } });


        const updatedAt = new Date(userResource.updatedAt);
        const now = new Date();
        
        const seconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);
        const diffTime = seconds / 3600; // difference in hours

        await this.updateGold(authId, userResource, diffTime);
        await this.updateResearchPoint(authId, userResource, diffTime);

        await prisma.userResource.update({
            where: { id: userResource.id },
            data: { gold: userResource.gold, researchPoint: userResource.researchPoint },
        });
    }

    async updateGold(authId: number, userResource: UserResource, diffTime: number)
    {
        // Get the total workers of the player across all their cities
        const userCities = (await prisma.userCity.findMany({ where: { userId:  authId}, select: { cityId: true } })).map(c=> c.cityId);
        const cityPopulation = await prisma.cityPopulation.findMany({ where: { cityId: { in: userCities } } });

        // Sum the total population
        const totalPopulation = sumProperty(cityPopulation, 'population');

        let goldProduction = 0;

        if (totalPopulation > 0) {
            // If there is population, calculate how much gold is added
            const citizen_gold = 3;
            goldProduction = citizen_gold * totalPopulation;

            userResource.gold += ( goldProduction * diffTime);
        }

        // Subtract maintenance costs
        let goldConsume = 0;

        // Gold consumption of units
        const regiments = await prisma.regiment.findMany({
            where: { userId: authId },
            include: {
            regimentsUnits: {
                include: { unit: true }, // Include the details of each unit
            },
            },
        });

        // Calculate total consumption
        const unitsConsume = regiments
        .map(regiment => {
            // Check if there are units under construction (equivalent to UnitHelper::checkConstructedTime)
            // Assuming you have a similar function:
            // checkConstructedTime(regiment); //TODO HELPER 

            // Calculate consumption of all units in the regiment
            const regimentConsume = regiment.regimentsUnits
            .map(ru => {
                const consume = ru.cant * ru.unit.gold; // gold per unit
                return regiment.travel === 1 ? consume * 2 : consume;
            })
            .reduce((acc, val) => acc + val, 0);

            return regimentConsume;
        })
        .reduce((acc, val) => acc + val, 0);

        // Accumulate total gold consumption of units
        goldConsume += unitsConsume;

        // Get the ID of the research "Letter Chute"
        const research = await prisma.research.findFirst({
            where: { name: 'Letter Chute' },
            select: { id: true },
        });

        let scientistsGold = 6;

        // Check if the user has this research
        if (research) {
            const hasResearch = await prisma.userResearch.findFirst({
                where: { userId: authId, researchId: research.id },
            });

            if (hasResearch) {
                scientistsGold = 3;
            }
        }

        // Calculate gold consumption of scientists
        // cityPopulation is an array of CityPopulation objects already obtained
        const totalScientists = sumProperty(cityPopulation, 'scientists');
        const scientistsConsume = scientistsGold * totalScientists;

        // Accumulate total gold consumption
        goldConsume += scientistsConsume;

        // Reduce user's gold according to elapsed time
        userResource.gold = userResource.gold - goldConsume * diffTime;

        // If gold is depleted
        if (userResource.gold < 0) {
            // Gold is depleted, activate maintenance system
            userResource.gold = 0;

            // Remove all scientists
            await Promise.all(
                cityPopulation.map(city =>
                prisma.cityPopulation.update({
                    where: { id: city.id },
                    data: { scientists: 0 },
                })
                )
            );

            // If unit consumption exceeds production
            if (unitsConsume > goldProduction) {
                // await removeUnitFromGoldConsume(unitsConsume, goldProduction); //TODO HELPER
            }
        }

        // Save changes to userResource
        await prisma.userResource.update({
            where: { id: userResource.id },
            data: { gold: userResource.gold },
        });
    }

    async updateResearchPoint(authId: number, userResource: UserResource, diffTime: number)
    {
        // Get the total researchers of the player across all their cities
        const userCities = (await prisma.userCity.findMany({ 
            where: { userId: authId }, 
            select: { cityId: true } 
        })).map(c => c.cityId);

        const cityPopulation = await prisma.cityPopulation.findMany({
            where: { cityId: { in: userCities } },
            include: { city: {
                include: { userCities: true } // include related userCities
              } } // Include related city and userCity for capital & corruption
        });

        // Calculate the effective number of scientists
        const scientists = cityPopulation.map(cp => {
            // Get the UserCity corresponding to the current user
            const userCity = cp.city.userCities.find(uc => uc.userId === authId);
            if (!userCity) return 0;
          
            if (userCity.capital) {
              return cp.scientists;
            } else {
                // Check if the city has corruption
                //   const corruption = 1 - getCorruption(cp.city); // TODO helper function
                const corruption = 1;
                return corruption === 1 ? cp.scientists : cp.scientists * corruption;
            }
        });

        // Sum total scientists
        const totalScientists = scientists.reduce((acc, val) => acc + val, 0);

        if (totalScientists > 0) {
            // If there are researchers, calculate how many research points (RP) to give
            const scientistsRP = 1;
            let pi = scientistsRP * totalScientists;

            // Check if the user has researches that increase RP per hour
            const researchIds = (await prisma.research.findMany({
                where: { name: { in: ['Paper', 'Ink', 'Mechanical Pen'] } },
                select: { id: true }
            })).map(r => r.id);

            const userResearchs = await prisma.userResearch.findMany({
                where: { userId: authId, researchId: { in: researchIds } },
                include: { research: true }
            });

            if (userResearchs.length > 0) {
                // Calculate total research bonus
                const researchBonuses = 1 + userResearchs.map(ur => {
                    switch(ur.research.name) {
                        case 'Paper':
                            return 0.02;
                        case 'Ink':
                            return 0.04;
                        case 'Mechanical Pen':
                            return 0.08;
                        default:
                            return 0;
                    }
                }).reduce((acc, val) => acc + val, 0 as number);

                pi = pi * researchBonuses;
            }

            // Add research points to the user's resource based on elapsed time
            userResource.researchPoint += (pi * diffTime);
        }

        // Save the updated userResource
        await prisma.userResource.update({
            where: { id: userResource.id },
            data: { researchPoint: userResource.researchPoint },
        });
    }
}