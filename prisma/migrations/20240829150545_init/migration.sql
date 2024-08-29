-- DropIndex
DROP INDEX "Measure_measure_uuid_key";

-- AlterTable
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_pkey" PRIMARY KEY ("measure_uuid");
