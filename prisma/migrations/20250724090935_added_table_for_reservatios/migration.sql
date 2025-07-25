-- CreateTable
CREATE TABLE "CarReservationApproval" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarReservationApproval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarReservationApproval_userId_idx" ON "CarReservationApproval"("userId");

-- CreateIndex
CREATE INDEX "CarReservationApproval_carId_idx" ON "CarReservationApproval"("carId");

-- AddForeignKey
ALTER TABLE "CarReservationApproval" ADD CONSTRAINT "CarReservationApproval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarReservationApproval" ADD CONSTRAINT "CarReservationApproval_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
