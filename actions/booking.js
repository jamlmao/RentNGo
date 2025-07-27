"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from '@supabase/supabase-js';

export async function createBooking() {
    try{

        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");
    
        const user = await db.user.findUnique({
          where: { clerkUserId: userId },
        });
    
        if (!user) throw new Error("User not found");
        
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        
        const id = uuidv4();

        const car = await db.car.findUnique({
            where: { id: carId },
        });

        if (!car) throw new Error("Car not found");

        const startDate = new Date();
        const endDate = new Date();
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalPrice = days * car.price;

        const booking = await db.booking.create({
            data: {
                id,
                userId: user.id,
                carId: car.id,
                startDate,
                endDate,
                totalPrice,
            }
        });

        // Update car status to 'reserved'
        await db.car.update({
            where: { id: car.id },
            data: { status: 'reserved' },
        });

        return { success: true, message: "Booking created successfully" };

    }catch(error){
        console.error("Error creating booking:", error);
        return { success: false, message: "Failed to create booking" };
    }

}


export async function getBookings(search) {
    try{
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");
        
        if (user.role !== "ADMIN") {
          throw new Error("Unauthorized: Admins only");
        }

        let whereClause = {};
        if (search) {
            whereClause.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { phoneNumber: { contains: search, mode: 'insensitive' } } },
                { car: { brand: { contains: search, mode: 'insensitive' } } },
                { car: { model: { contains: search, mode: 'insensitive' } } },
                { car: { year: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const pendingBookings = await db.booking.findMany({
            where: {
                car: {
                    status: "RESERVED"
                  },
                ...whereClause,
            },
            include:{
                user: {
                    select: {
                                name: true,
                                email: true,
                                phoneNumber: true,
                                address: true,
                                city: true,
                                state: true,
                    },
                },
                car: {
                    select: {
                        brand: true,
                        model: true,
                        year: true,
                        price: true,
                        images: true,
                        status: true,
                    }
                }
            }
        });

        // Convert Decimal fields to strings
        const convertPriceToString = pendingBookings.map(booking => ({
            ...booking,
            totalPrice: booking.totalPrice.toString(),
            car: {
                ...booking.car,
                price: booking.car.price.toString()
            }
        }));    
    return { success: true, data: convertPriceToString };

    }catch(error){
        console.error("Error getting bookings:", error);
        return { success: false, message: "Failed to get bookings" };
    }
}


export async function processBooking(bookingId, action) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        if (user.role !== "ADMIN") {
            throw new Error("Unauthorized: Admins only");
        }

        const booking = await db.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) throw new Error("Booking not found");

        let carStatus;
        if (action === "ACCEPT") {
            carStatus = "RENTED";
            // Add entry to UserRentedCar
            await db.userRentedCar.create({
                data: {
                    userId: booking.userId,
                    carId: booking.carId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    rentedAt: new Date(), // date when admin accepted the request
                    returnDate: null, // Initialize returnDate as null 
                },
            });
        } else if (action === "REJECT") {
            carStatus = "AVAILABLE";
        } else {
            throw new Error("Invalid action");
        }

        // Update the car status
        await db.car.update({
            where: { id: booking.carId },
            data: { status: carStatus, rentedAt: action === "ACCEPT" ? new Date() : null, rentalCount: action === "ACCEPT" ? { increment: 1 } : undefined },
        });

        return { success: true, message: `Booking ${action.toLowerCase()}ed and car status updated` };
    } catch (error) {
        console.error("Error processing booking:", error);
        return { success: false, message: "Failed to process booking" };
    }
}