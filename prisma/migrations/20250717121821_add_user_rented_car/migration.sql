-- CreateTable
CREATE TABLE "UserRentedCar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "rentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRentedCar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRentedCar_userId_idx" ON "UserRentedCar"("userId");

-- CreateIndex
CREATE INDEX "UserRentedCar_carId_idx" ON "UserRentedCar"("carId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRentedCar_userId_carId_key" ON "UserRentedCar"("userId", "carId");

-- AddForeignKey
ALTER TABLE "UserRentedCar" ADD CONSTRAINT "UserRentedCar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRentedCar" ADD CONSTRAINT "UserRentedCar_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
