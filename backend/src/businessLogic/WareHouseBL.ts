import { world } from "../config";
import prisma from "../dataAccess/prisma/prisma";

export class WareHouseBL {
    // Check that city resources do not exceed the warehouse capacity
    public static async checkCapacity(cityId: number) {
        let capacity = world.warehouse.capacity_base;
        const warehouseCapacityPerLevel = world.warehouse.capacity;

        const cityBuilding = await prisma.cityBuilding.findFirst({
            where: {
                cityId,
                buildingLevel: { buildingId: 3 },
            },
            include: {
                buildingLevel: true,
            },
        });

        if (cityBuilding) {
            const level = cityBuilding.buildingLevel.level;
            capacity += warehouseCapacityPerLevel * level;
        }

        // Update city resources clamped to capacity
        await prisma.city.update({
            where: { id: cityId },
            data: {
                wood: { set: Math.min((await prisma.city.findUnique({ where: { id: cityId } }))!.wood, capacity) },
                wine: { set: Math.min((await prisma.city.findUnique({ where: { id: cityId } }))!.wine, capacity) },
                marble: { set: Math.min((await prisma.city.findUnique({ where: { id: cityId } }))!.marble, capacity) },
                glass: { set: Math.min((await prisma.city.findUnique({ where: { id: cityId } }))!.glass, capacity) },
                sulfur: { set: Math.min((await prisma.city.findUnique({ where: { id: cityId } }))!.sulfur, capacity) },
            },
        });
    }

    // Returns the amount of resources protected in the warehouse
    public static async checkProtected(cityId: number): Promise<number> {
        const cityBuilding = await prisma.cityBuilding.findFirst({
            where: {
                cityId,
                buildingLevel: { buildingId: 3 },
            },
            include: { buildingLevel: true },
        });

        if (!cityBuilding) return 0;

        const level = cityBuilding.buildingLevel.level;
        return world.warehouse.resource_protected * level;
    }
}