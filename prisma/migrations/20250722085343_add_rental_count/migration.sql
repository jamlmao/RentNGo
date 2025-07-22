/*
  Warnings:

  - You are about to drop the `DealershipInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestDriveRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestDriveRequest" DROP CONSTRAINT "TestDriveRequest_carId_fkey";

-- DropForeignKey
ALTER TABLE "TestDriveRequest" DROP CONSTRAINT "TestDriveRequest_userId_fkey";

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "rentalCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "DealershipInfo";

-- DropTable
DROP TABLE "TestDriveRequest";

-- DropEnum
DROP TYPE "TestDriveStatus";
