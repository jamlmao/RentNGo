/*
  Warnings:

  - The values [SOLD,PENDING] on the enum `CarStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CarStatus_new" AS ENUM ('AVAILABLE', 'RENTED', 'RESERVED');
ALTER TABLE "Car" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Car" ALTER COLUMN "status" TYPE "CarStatus_new" USING ("status"::text::"CarStatus_new");
ALTER TYPE "CarStatus" RENAME TO "CarStatus_old";
ALTER TYPE "CarStatus_new" RENAME TO "CarStatus";
DROP TYPE "CarStatus_old";
ALTER TABLE "Car" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
