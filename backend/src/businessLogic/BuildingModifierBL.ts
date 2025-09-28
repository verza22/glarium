import prisma from "../dataAccess/prisma/prisma";
import { Resources } from "@shared/types/others";
import { BuildingBL } from "./buildingBL";

export class BuildingModifierBL {
    // Apply discounts to city resources based on building levels and research
    public static async lessCost(authId: number, cityId: number, resources: Resources, typeBuilding = true) {
        const discountResearch = await BuildingBL.lessCostResearch(authId); // function to get research discount

        // Get city buildings that apply resource discounts
        const cityBuildingIds = await prisma.cityBuilding.findMany({
            where: { cityId },
            select: { buildingLevelId: true },
        });
        const buildingLevelIds = cityBuildingIds.map(b => b.buildingLevelId);

        const buildingLevels = await prisma.buildingLevel.findMany({
            where: {
                id: { in: buildingLevelIds },
                buildingId: { in: [6, 7, 8, 9, 10] }
            },
        });

        buildingLevels.forEach(level => {
            let discount = 1 - level.level * 0.01;
            if (typeBuilding) discount -= discountResearch;

            switch (level.buildingId) {
                case 6: // Carpentry
                    if (resources.wood != null) resources.wood *= discount;
                    break;
                case 7: // Optics
                    if (resources.glass != null) resources.glass *= discount;
                    break;
                case 8: // Pyrotechnics
                    if (resources.sulfur != null) resources.sulfur *= discount;
                    break;
                case 9: // Wine dam
                    if (resources.wine != null) resources.wine *= discount;
                    break;
                case 10: // Architect office
                    if (resources.marble != null) resources.marble *= discount;
                    break;
            }
        });
    }

    // Increase city resources based on certain building levels
    public static async improvedResources(cityId: number, resources: Resources) {
        // Get city buildings that increase resources
        const cityBuildingIds = await prisma.cityBuilding.findMany({
            where: { cityId },
            select: { buildingLevelId: true },
        });
        const buildingLevelIds = cityBuildingIds.map(b => b.buildingLevelId);

        const buildingLevels = await prisma.buildingLevel.findMany({
            where: {
                id: { in: buildingLevelIds },
                buildingId: { in: [11, 12, 13, 14, 15] }
            },
        });

        buildingLevels.forEach(level => {
            const increase = 1 + level.level * 0.02;

            switch (level.buildingId) {
                case 11: // Cabin
                    if (resources.wood != null) resources.wood *= increase;
                    break;
                case 12: // Glass blower
                    if (resources.glass != null) resources.glass *= increase;
                    break;
                case 13: // Alchemist tower
                    if (resources.sulfur != null) resources.sulfur *= increase;
                    break;
                case 14: // Wine maker
                    if (resources.wine != null) resources.wine *= increase;
                    break;
                case 15: // Quarry
                    if (resources.marble != null) resources.marble *= increase;
                    break;
            }
        });
    }

    // Example stub: get total research discount (implement accordingly)
    private static async lessCostResearch(): Promise<number> {
        // Your logic to calculate research-based discount
        return 0;
    }
}