/*
  Warnings:

  - A unique constraint covering the columns `[movementId]` on the table `MovementResource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `MovementResource_movementId_key` ON `MovementResource`(`movementId`);
