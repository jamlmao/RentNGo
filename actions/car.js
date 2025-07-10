import { auth } from '@clerk/nextjs/dist/types/server';
import {GoogleGenerativeAI} from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';


async function fileToBase64(file){
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer.toString('base64');
}




export async function CarImageWithAI(){
    try {
        if(!process.env.GEMINI_API_KEY){
            throw new Error('GEMINI_API_KEY is not set');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

        const base64 = await fileToBase64(file);
        
        const imagePart ={
            inlineData: {
                data: base64,
                mimeType: file.type,
            },
        };

        const prompt = `
            Analyze the car image and extract the following information:
            1. Brand: The brand of the car
            2. Model: The model of the car
            3. Year: The year of the car
            4. Color: The color of the car
            5. Engine: The engine of the car
            6. Transmission: The transmission of the car
            7. Fuel: The fuel of the car
            8. Price: The price of the car
            9. Mileage: The mileage of the car

            Return the information in a clear and concise JSON format with these fields:
           {
             "brand": "string",
             "model": "string",
             "year": 0000,
             "color": "string",
             "engine": "string",
             "transmission": "string",
             "price": 0.00,
             "mileage": 0.00,
             "bodyType": "string",
             "seats": 0,
             "fuelType": "string",
             "confidence": 0.0

           }

           For confidence, return a value between 0 and 1. representing how confident you are in the accuracy of the identified information.
           Only return the JSON object, no other text or comments.
        `;

        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/^```json\n|```$/g, '').trim();


        try{
            const jsonResponse = JSON.parse(cleanedText);
            const requiredFields = [
                "brand",
                "model",
                "year",
                "price",
                "mileage",
                "bodyType",
                "seats",
                "fuelType",
                "transmission",
                "color",
                "confidence",
            ]

            const missingFields = requiredFields.filter(
                (field) => !(field in jsonResponse)
            );

            if (missingFields.length > 0){
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            return {
                success: true,
                data: jsonResponse,
            }
            
        }catch(error){
            console.error('Error in CarImageWithAI:', error); 
            return {
                success: false,
                error: "Failed to parse JSON response",
            }
        }
        
    }catch (error) {
       throw new Error(`Error in Gemini API: ${error.message}`);


    }
}

export async function createCar({carData, Images}){

    try{
        const {userId} = await auth(); 
        if(!userId) throw new Error("Unauthorized"); 
        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        })

        if(!user) throw new Error ("User not Found");

        const carId = uuidv4();
        const folderPath = `cars/${carId}`;

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const imageUrls = []; // store images 

        for(let i = 0; i < Images.length; i++){
            const base64 = Images[i];

            // will skip the data if its invalid
            if (!base64 || !base64.startsWith("data:image/")){
                console.warn(`Invalid image data for car ${carId}`);
                continue;
            }
            // extract 'data:image/filename;base64,'
            const base64Data = base64.split(',')[1];
            const imageBuffer = Buffer.from(base64Data, 'base64');

            const mimeMatch = base64.match(/data:image\/([a-zA-Z0-9]+);base64,/);
            const fileType = mimeMatch ? mimeMatch[1] : 'jpeg';


            const fileName = `image-${Date.now()}.${i}.${fileType}`;
            const filePath =`${folderPath}/${fileName}`;
            
            await supabase.storage.from('car-images').upload(filePath, imageBuffer,{
                contentType:`image/${fileType}`,
            })

            if (error){
                console.error(`Error uploading image ${fileName}:`, error);
                throw new Error(`Failed to upload image ${fileName}`);
            }


            const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;

            imageUrls.push(publicUrl);
        }

        if(imageUrls.length === 0){
            throw new Error("No valid images uploaded");
        }

        const car = await db.car.create({
            id: carId,
            brand: carData.brand,
            model: carData.model,
            year: carData.year,
            price: carData.price,
            mileage: carData.mileage,
            fuelType: carData.fuelType,
            transmission: carData.transmission,
            color: carData.color,
            bodyType: carData.bodyType,
            description: carData.description,
            images: imageUrls,
            featured: false,
            status: 'AVAILABLE',
            createdAt: new Date(),
            updatedAt: new Date(),
            seats: carData.seats,
        })

        revalidatePath('/admin/cars') 

        return {
            success: true,
        }

    }catch(error){
        throw new Error(`Failed to create car: ${error.message}`);
    }
}