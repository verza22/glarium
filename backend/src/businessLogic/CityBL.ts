import prisma from "../dataAccess/prisma/prisma";
import { world } from "../config";
import { BuildingModifierBL } from "./buildingModifierBL";
import { Resources } from "@shared/types/others";
import { PopulationBL } from "./populationBL";
import { UnitBL } from "./unitBL";

export class CityBL {

    // Add resources to a city
    public static async addResources(cityId: number, resources: Resources) {
        await prisma.city.update({
            where: { id: cityId },
            data: {
                wood: { increment: resources.wood },
                wine: { increment: resources.wine },
                marble: { increment: resources.marble },
                glass: { increment: resources.glass },
                sulfur: { increment: resources.sulfur },
            },
        });
    }

    // Check if city has enough resources
    public static async compareResources(cityId: number, resources: any): Promise<boolean> {
        const city = await prisma.city.findUnique({ where: { id: cityId } });
        if (!city) return false;

        return (
            city.wood >= resources.wood &&
            city.marble >= resources.marble &&
            city.wine >= resources.wine &&
            city.glass >= resources.glass &&
            city.sulfur >= resources.sulfur
        );
    }

    // Remove resources from a city
    public static async removeResources(cityId: number, resources: any) {
        await prisma.city.update({
            where: { id: cityId },
            data: {
                wood: { decrement: resources.wood },
                wine: { decrement: resources.wine },
                marble: { decrement: resources.marble },
                glass: { decrement: resources.glass },
                sulfur: { decrement: resources.sulfur },
            },
        });
    }

    // Update city resources based on workers, island type, and corruption
    public static async updateResources(cityId: number) {
        const city = await prisma.city.findUnique({
            where: { id: cityId },
            include: {
                population: true,
                userCities: true,
                islandCity: { where: { cityId: cityId }, include: { island: true } }
            },
        });
        if (!city) return;

        // Calculate time difference in hours since last update
        const updatedAt = city.updatedAt;
        const now = new Date();
        const diffTime = (now.getTime() - updatedAt.getTime()) / 1000 / 3600;

        // Initialize resources collection
        const collect = UnitBL.newCollect();
        collect.wood = city.population?.workerForest ? diffTime * city.population.workerForest : 0;

        // Assign based on island special resource
        switch (city.islandCity?.island.type) {
            case 1: collect.wine = city.population?.workerMine ? diffTime * city.population.workerMine : 0; break;
            case 2: collect.marble = city.population?.workerMine ? diffTime * city.population.workerMine : 0; break;
            case 3: collect.glass = city.population?.workerMine ? diffTime * city.population.workerMine : 0; break;
            case 4: collect.sulfur = city.population?.workerMine ? diffTime * city.population.workerMine : 0; break;
        }

        // Apply building bonuses
        await BuildingModifierBL.improvedResources(city.id, collect);

        // Apply corruption if city is not capital
        if (!city.userCities.find(uc => uc.capital === true)) {
            const corruption = 1 - await PopulationBL.getCorruption(city.userCities[0].userId, city.id);
            if (corruption !== 1) {
                collect.wood *= corruption;
                collect.wine *= corruption;
                collect.marble *= corruption;
                collect.glass *= corruption;
                collect.sulfur *= corruption;
            }
        }

        // Update city resources with global bonus
        await prisma.city.update({
            where: { id: cityId },
            data: {
                wood: { increment: collect.wood * world.bonus.resources },
                wine: { increment: collect.wine * world.bonus.resources },
                marble: { increment: collect.marble * world.bonus.resources },
                glass: { increment: collect.glass * world.bonus.resources },
                sulfur: { increment: collect.sulfur * world.bonus.resources },
            },
        });

        // TODO: Handle wine consumption and apply lessCost if needed
        // This part requires fetching cityPopulation and adjusting wine accordingly
    }

    // Update city including resources, movements, and combats
    public static async updateCity(cityId: number) {
        await this.updateResources(cityId);

        // TODO: Implement returnMovementResources, deliveredResourcesTo, endAndReturnAttackFromCity, etc.
        // These would be your movement and combat helper functions
    }

    // Get current user cities
    public static async myCities(userId: number): Promise<number[]> {
        const cities = await prisma.userCity.findMany({
            where: { userId },
            select: { cityId: true },
        });
        return cities.map(c => c.cityId);
    }

    // Create a city and all related records
    static async createCity(
        userId: number,
        islandId: number,
        position: number,
        capital = false,
        constructedAt: Date | null = null
    ) {
        // Create new city
        const city = await prisma.city.create({
            data: {
                name: 'Polis',
                wood: 0,
                wine: 0,
                marble: 0,
                glass: 0,
                sulfur: 0,
                apoint: 2,
                constructedAt
            }
        });

        // Link city to user
        await prisma.userCity.create({
            data: {
                userId,
                cityId: city.id,
                capital,
            },
        });

        // Link city to island
        await prisma.islandCity.create({
            data: {
                islandId,
                cityId: city.id,
                position,
            },
        });

        // Create island donations
        await prisma.islandDonation.createMany({
            data: [
                { islandId, cityId: city.id, type: 0, donated: 0 },
                { islandId, cityId: city.id, type: 1, donated: 0 },
            ],
        });

        // Create city population
        await prisma.cityPopulation.create({
            data: {
                cityId: city.id,
                populationMax: 100,
                population: 40,
                workerForest: 0,
                workerMine: 0,
                wineMax: 0,
                wine: 0,
                scientistsMax: 0,
                scientists: 0
            }
        });

        // Create town hall
        await prisma.cityBuilding.create({
            data: {
                buildingLevelId: 1,
                cityId: city.id,
                position: 0,
            },
        });

        return city.id;
    }
}