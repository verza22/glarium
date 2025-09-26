-- CreateTable
CREATE TABLE `Movement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `startAt` DATETIME(3) NULL,
    `endAt` DATETIME(3) NULL,
    `returnAt` DATETIME(3) NULL,
    `delivered` BOOLEAN NOT NULL,
    `cancelled` BOOLEAN NOT NULL,
    `userId` BIGINT NOT NULL,
    `cityFromId` BIGINT NOT NULL,
    `cityToId` BIGINT NOT NULL,
    `movementTypeId` BIGINT NOT NULL,
    `tradeShip` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Movement` ADD CONSTRAINT `Movement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movement` ADD CONSTRAINT `Movement_cityFromId_fkey` FOREIGN KEY (`cityFromId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movement` ADD CONSTRAINT `Movement_cityToId_fkey` FOREIGN KEY (`cityToId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movement` ADD CONSTRAINT `Movement_movementTypeId_fkey` FOREIGN KEY (`movementTypeId`) REFERENCES `MovementType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
