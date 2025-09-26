-- CreateTable
CREATE TABLE `MovementResource` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `movementId` BIGINT NOT NULL,
    `wood` INTEGER NOT NULL,
    `wine` INTEGER NOT NULL,
    `marble` INTEGER NOT NULL,
    `glass` INTEGER NOT NULL,
    `sulfur` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovementRegiment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `movementId` BIGINT NOT NULL,
    `regimentId` BIGINT NOT NULL,
    `size` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CombatReport` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `movementRegimentId` BIGINT NOT NULL,
    `result` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CombatReportDetail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `combatReportId` BIGINT NOT NULL,
    `round` INTEGER NOT NULL,
    `typeAttack` INTEGER NOT NULL,
    `result` INTEGER NOT NULL,
    `attackUnitId` BIGINT NOT NULL,
    `attackBeforeCant` INTEGER NOT NULL,
    `attackAfterCant` INTEGER NOT NULL,
    `defenseUnitId` BIGINT NOT NULL,
    `defenseBeforeCant` INTEGER NOT NULL,
    `defenseAfterCant` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MovementResource` ADD CONSTRAINT `MovementResource_movementId_fkey` FOREIGN KEY (`movementId`) REFERENCES `Movement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovementRegiment` ADD CONSTRAINT `MovementRegiment_movementId_fkey` FOREIGN KEY (`movementId`) REFERENCES `Movement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovementRegiment` ADD CONSTRAINT `MovementRegiment_regimentId_fkey` FOREIGN KEY (`regimentId`) REFERENCES `Regiment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CombatReport` ADD CONSTRAINT `CombatReport_movementRegimentId_fkey` FOREIGN KEY (`movementRegimentId`) REFERENCES `MovementRegiment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CombatReportDetail` ADD CONSTRAINT `CombatReportDetail_combatReportId_fkey` FOREIGN KEY (`combatReportId`) REFERENCES `CombatReport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CombatReportDetail` ADD CONSTRAINT `CombatReportDetail_attackUnitId_fkey` FOREIGN KEY (`attackUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CombatReportDetail` ADD CONSTRAINT `CombatReportDetail_defenseUnitId_fkey` FOREIGN KEY (`defenseUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
