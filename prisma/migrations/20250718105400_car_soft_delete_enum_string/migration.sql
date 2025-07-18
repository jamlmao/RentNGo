-- CreateEnum
CREATE TYPE "CarDeleteStatus" AS ENUM ('0', '1');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "isDeleted" "CarDeleteStatus" NOT NULL DEFAULT '0';
