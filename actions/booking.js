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


export async function getBookings() {
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

        const pendingBookings = await db.car.findMany({
            where: {
                status: "RESERVED",
            },
            include:{
                bookings: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                phoneNumber: true,
                                address: true,
                                city: true,
                                state: true,
                            }
                        },
                        car: {
                            select: {
                                brand: true,
                                model: true,
                                year: true,
                                price: true,
                                image: true,
                            }
                        }
                    }
                }
            }
        });
    return { success: true, data: pendingBookings };

    }catch(error){
        console.error("Error getting bookings:", error);
        return { success: false, message: "Failed to get bookings" };
    }
}