-- CreateTable
CREATE TABLE `CityBuilding` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `constructedAt` DATETIME(3) NULL,
    `buildingLevelId` BIGINT NOT NULL,
    `cityId` BIGINT NOT NULL,
    `position` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Forest` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `level` INTEGER NOT NULL,
    `workers` INTEGER NOT NULL,
    `wood` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mine` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `level` INTEGER NOT NULL,
    `workers` INTEGER NOT NULL,
    `wood` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IslandSector` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CityBuilding` ADD CONSTRAINT `CityBuilding_buildingLevelId_fkey` FOREIGN KEY (`buildingLevelId`) REFERENCES `BuildingLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CityBuilding` ADD CONSTRAINT `CityBuilding_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
