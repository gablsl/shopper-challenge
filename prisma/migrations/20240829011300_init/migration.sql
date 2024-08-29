/*
  Warnings:

  - Made the column `measure_value` on table `Measure` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Measure" ALTER COLUMN "measure_value" SET NOT NULL;
