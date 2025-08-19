-- AlterTable
ALTER TABLE "public"."Apartment" ADD COLUMN     "iconColor" TEXT NOT NULL DEFAULT '#3B82F6',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'available';
