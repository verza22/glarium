-- CreateTable
CREATE TABLE `UserResearch` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` BIGINT NOT NULL,
    `researchId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchUnit` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `unitId` BIGINT NOT NULL,
    `researchId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchBuilding` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `buildingId` BIGINT NOT NULL,
    `researchId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserResearch` ADD CONSTRAINT `UserResearch_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResearch` ADD CONSTRAINT `UserResearch_researchId_fkey` FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchUnit` ADD CONSTRAINT `ResearchUnit_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchUnit` ADD CONSTRAINT `ResearchUnit_researchId_fkey` FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchBuilding` ADD CONSTRAINT `ResearchBuilding_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `Building`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchBuilding` ADD CONSTRAINT `ResearchBuilding_researchId_fkey` FOREIGN KEY (`researchId`) REFERENCES `Research`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
