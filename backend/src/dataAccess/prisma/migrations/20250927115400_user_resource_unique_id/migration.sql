/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserResource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserResource_userId_key` ON `UserResource`(`userId`);
