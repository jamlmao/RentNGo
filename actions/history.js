"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function getUserHistory(search = " ") {
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

        let whereClause = {};

        if (search) {
          whereClause.OR = [
            { car: { brand: { contains: search, mode: "insensitive" } } },
            { car: { model: { contains: search, mode: "insensitive" } } },
          ];

          const searchYear = parseInt(search);
          if (!isNaN(searchYear)) {
            whereClause.OR.push({ car: { year: { equals: searchYear } } });
          }
        }

        const userHistory = await db.userRentedCar.findMany({
            where: {
                userId: user.id,
                ...whereClause, // Ensure the whereClause is applied here
            },
            include: {
                car: {
                    select: {
                        brand: true,
                        model: true,
                        year: true,
                        price: true,
                        images: true,
                    },
                },
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
            },
            orderBy: {
                rentedAt: 'desc',
            },
        });

        console.log('Raw User History:', userHistory); // Log raw data

        const serializedHistory = userHistory.map(entry => {
            const rentedAt = new Date(entry.rentedAt);
            const returnDate = entry.returnDate ? new Date(entry.returnDate) : new Date();
            const daysRented = Math.ceil((returnDate - rentedAt) / (1000 * 60 * 60 * 24));
            const totalPrice = entry.car.price.toNumber() * daysRented;

            return {
                ...entry,
                car: {
                    ...entry.car,
                    price: totalPrice,
                },
            };
        });

        console.log('Returning from getUserHistory:', {
            success: true,
            data: serializedHistory,
        });

        return {
            success: true,
            data: serializedHistory,
        };


    }catch(error){
        console.error("Error fetching user history:", error);
        return {
            success: false,
            message: "Failed to fetch user history",
            error: error.message
        }
    }
}


