-- CreateTable
CREATE TABLE `BuildingLevel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `buildingId` BIGINT NOT NULL,
    `level` INTEGER NOT NULL,
    `wood` INTEGER NOT NULL,
    `wine` INTEGER NOT NULL,
    `marble` INTEGER NOT NULL,
    `glass` INTEGER NOT NULL,
    `sulfur` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BuildingLevel` ADD CONSTRAINT `BuildingLevel_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `Building`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
