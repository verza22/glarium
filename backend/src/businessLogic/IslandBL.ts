import prisma from "../dataAccess/prisma/prisma";
import dayjs from 'dayjs';

export class IslandBL {
    // Check if forest or mine upgrades are completed
    public static async checkUpgrades(islandId: number) {
        // Fetch the island including forest and mine relations
        const island = await prisma.island.findUnique({
            where: { id: islandId },
            include: {
                forest: true,
                mine: true,
            },
        });

        if (!island) return;

        // Check if forest upgrade is completed
        if (island.forestConstructedAt) {
            if (dayjs(island.forestConstructedAt).isBefore(dayjs())) {
                // Upgrade forest
                const nextLevel = await prisma.forest.findFirst({
                    where: { level: island.forest.level + 1 },
                });

                if (nextLevel) {
                    await prisma.island.update({
                        where: { id: island.id },
                        data: {
                            donatedForest: 0,
                            forestId: nextLevel.id,
                            forestConstructedAt: null,
                        },
                    });
                }
            }
        }

        // Check if mine upgrade is completed
        if (island.mineConstructedAt) {
            if (dayjs(island.mineConstructedAt).isBefore(dayjs())) {
                // Upgrade mine
                const nextLevel = await prisma.mine.findFirst({
                    where: { level: island.mine.level + 1 },
                });

                if (nextLevel) {
                    await prisma.island.update({
                        where: { id: island.id },
                        data: {
                            donatedMine: 0,
                            mineId: nextLevel.id,
                            mineConstructedAt: null,
                        },
                    });
                }
            }
        }
    }
}