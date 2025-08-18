-- CreateTable
CREATE TABLE "public"."Apartment" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "address" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "zone" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);
