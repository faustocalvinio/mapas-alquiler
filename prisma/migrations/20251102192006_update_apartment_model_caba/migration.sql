/*
  Warnings:

  - You are about to drop the column `price` on the `Apartment` table. All the data in the column will be lost.
  - Added the required column `priceUSD` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Apartment" DROP COLUMN "price",
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "expenses" DOUBLE PRECISION,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "priceARS" DOUBLE PRECISION,
ADD COLUMN     "priceUSD" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rooms" INTEGER,
ADD COLUMN     "squareMeters" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
