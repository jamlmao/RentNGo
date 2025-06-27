import { currentUser } from "@clerk/nextjs/server";
import { db } from './generated/prisma';

export const checkUser = async (req, res, next) => {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            },
        });

        if (loggedInUser) {
            return loggedInUser;
        }

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name:`${user.firstName} ${user.lastName}`,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
            },
        });
        return newUser;
    }catch(error){
        console.error("Error checking user:", error);
        //return null
       
    }



}
