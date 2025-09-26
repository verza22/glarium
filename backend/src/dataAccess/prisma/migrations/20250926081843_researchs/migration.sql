-- CreateTable
CREATE TABLE `Research` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `researchCategoryId` BIGINT NOT NULL,
    `level` INTEGER NOT NULL,
    `cost` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Research` ADD CONSTRAINT `Research_researchCategoryId_fkey` FOREIGN KEY (`researchCategoryId`) REFERENCES `ResearchCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
