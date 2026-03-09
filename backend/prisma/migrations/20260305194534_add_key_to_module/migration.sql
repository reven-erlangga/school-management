/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `modules` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "modules" ADD COLUMN "key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "modules_key_key" ON "modules"("key");
