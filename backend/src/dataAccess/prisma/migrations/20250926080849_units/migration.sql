-- CreateTable
CREATE TABLE `CityPopulation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cityId` BIGINT NOT NULL,
    `populationMax` INTEGER NOT NULL,
    `population` DOUBLE NOT NULL,
    `workerForest` INTEGER NOT NULL,
    `workerMine` INTEGER NOT NULL,
    `wineMax` INTEGER NOT NULL,
    `wine` INTEGER NOT NULL,
    `scientistsMax` INTEGER NOT NULL,
    `scientists` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserResource` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `gold` DECIMAL(20, 4) NOT NULL,
    `researchPoint` DECIMAL(20, 4) NOT NULL,
    `tradeShip` INTEGER NOT NULL,
    `tradeShipAvailable` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `population` INTEGER NOT NULL,
    `size` INTEGER NOT NULL,
    `wood` INTEGER NOT NULL,
    `wine` INTEGER NOT NULL,
    `glass` INTEGER NOT NULL,
    `sulfur` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,
    `barrackLevel` INTEGER NOT NULL,
    `gold` INTEGER NOT NULL,
    `attack` INTEGER NOT NULL,
    `attackType` INTEGER NOT NULL,
    `defenseBlunt` INTEGER NOT NULL,
    `defenseSharp` INTEGER NOT NULL,
    `defenseDistance` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CityPopulation` ADD CONSTRAINT `CityPopulation_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResource` ADD CONSTRAINT `UserResource_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
