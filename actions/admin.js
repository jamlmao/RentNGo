"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function getAdminData() {
    const {userId} = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
    });

    if (!user || user.role !== "ADMIN"){
        return {authorized: false, message: "You are not authorized to access this page"};
    }

    return {authorized: true, user};

}