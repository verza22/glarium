-- CreateTable
CREATE TABLE `IslandCity` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `position` INTEGER NOT NULL,
    `islandId` BIGINT NOT NULL,
    `cityId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IslandCity` ADD CONSTRAINT `IslandCity_islandId_fkey` FOREIGN KEY (`islandId`) REFERENCES `Island`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IslandCity` ADD CONSTRAINT `IslandCity_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
