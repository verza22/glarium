/*
  Warnings:

  - A unique constraint covering the columns `[cityId]` on the table `IslandCity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `IslandCity_cityId_key` ON `IslandCity`(`cityId`);
