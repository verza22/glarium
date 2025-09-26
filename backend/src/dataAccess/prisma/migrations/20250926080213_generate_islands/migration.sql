-- CreateTable
CREATE TABLE `Island` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `islandSectorId` BIGINT NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL,
    `forestId` BIGINT NOT NULL,
    `mineId` BIGINT NOT NULL,
    `donatedForest` INTEGER NOT NULL,
    `donatedMine` INTEGER NOT NULL,
    `forestConstructedAt` DATETIME(3) NULL,
    `mineConstructedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Island` ADD CONSTRAINT `Island_islandSectorId_fkey` FOREIGN KEY (`islandSectorId`) REFERENCES `IslandSector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Island` ADD CONSTRAINT `Island_forestId_fkey` FOREIGN KEY (`forestId`) REFERENCES `Forest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Island` ADD CONSTRAINT `Island_mineId_fkey` FOREIGN KEY (`mineId`) REFERENCES `Mine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
