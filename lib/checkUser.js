import { currentUser } from "@clerk/nextjs/server";
import { db } from './prisma';

export const checkUser = async () => {
    const user = await currentUser();
    console.log("User object in checkUser:", user);

    if (!user) {
        return null;
    }

    try {
        // Try to find the user in the database
        let loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            },
        });

        // If not found, create the user
        if (!loggedInUser) {
            loggedInUser = await db.user.create({
                data: {
                    clerkUserId: user.id,
                    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
                    email: user.emailAddresses?.[0]?.emailAddress || "",
                    imageUrl: user.imageUrl || "",
                },
            });
            console.log("Created new user:", loggedInUser);
        }

        return loggedInUser;
    } catch (error) {
        console.error("Error checking user:", error);
        return null;
    }
};

