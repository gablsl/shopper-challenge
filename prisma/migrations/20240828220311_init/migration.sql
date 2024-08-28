-- CreateTable
CREATE TABLE "Customer" (
    "customer_code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Measure" (
    "measure_uuid" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT NOT NULL,
    "customerCustomer_code" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_code_key" ON "Customer"("customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "Measure_measure_uuid_key" ON "Measure"("measure_uuid");

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_customerCustomer_code_fkey" FOREIGN KEY ("customerCustomer_code") REFERENCES "Customer"("customer_code") ON DELETE SET NULL ON UPDATE CASCADE;
