/*
  Warnings:

  - You are about to alter the column `confirmed_value` on the `Measure` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Measure" ADD COLUMN     "image" TEXT,
ALTER COLUMN "confirmed_value" SET DATA TYPE INTEGER;
