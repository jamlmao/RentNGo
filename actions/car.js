"use server"

import { auth } from '@clerk/nextjs/server';
import {GoogleGenerativeAI} from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


async function fileToBase64(file){
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return buffer.toString('base64');
}




export async function CarImageWithAI(file){
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
            5. Body Type: The body type of the car
            6. Description: A simple one-sentence description of the car based on the image
            7. Confidence: A value between 0 and 1 representing how confident you are in the accuracy of the identified information
            8. Transmission: The transmission type of the car (e.g., Automatic, Manual)
            9. Fuel Type: The type of fuel the car uses (e.g., Petrol, Diesel, Electric, Hybrid)
            10. Seats: The seat capacity of the car (number)

            Return the information in a clear and concise JSON format with these fields:
           {
             "brand": "string",
             "model": "string",
             "year": 0000,
             "color": "string",
             "bodyType": "string",
             "description": "string",
             "confidence": 0.0,
             "transmission": "string",
             "fuelType": "string",
             "seats": 0
           }

           Only return the JSON object, no other text or comments.
        `;

        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        const text = response.text();
        // Extract the first {...} block from the response
        const match = text.match(/{[\s\S]*}/);
        if (!match) throw new Error("No JSON object found in response");
        const jsonResponse = JSON.parse(match[0]);


        try{
            const requiredFields = [
                "brand",
                "model",
                "year",
                "bodyType",
                "color",
                "description",
                "confidence",
                "transmission",
                "fuelType",
                "seats"
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

export async function createCar({ carData, Images }) {
  const images = Images; // or just use Images everywhere instead of images
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
  
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
  
      if (!user) throw new Error("User not found");
  
      // Create a unique folder name for this car's images
      const carId = uuidv4();
      const folderPath = `cars/${carId}`;
  
      // Initialize Supabase client for server-side operations
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
  
      // Upload all images to Supabase storage
      const imageUrls = [];
  
      for (let i = 0; i < images.length; i++) {
        const base64Data = images[i];
  
        // Skip if image data is not valid
        if (!base64Data || !base64Data.startsWith("data:image/")) {
          console.warn("Skipping invalid image data");
          continue;
        }
  
        // Extract the base64 part (remove the data:image/xyz;base64, prefix)
        const base64 = base64Data.split(",")[1];
        const imageBuffer = Buffer.from(base64, "base64");
  
        // Determine file extension from the data URL
        const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
        const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";
  
        // Create filename
        const fileName = `image-${Date.now()}-${i}.${fileExtension}`;
        const filePath = `${folderPath}/${fileName}`;
  
        // Upload the file buffer directly
        const { data, error } = await supabase.storage
          .from("car-images")
          .upload(filePath, imageBuffer, {
            contentType: `image/${fileExtension}`,
          });
  
        if (error) {
          console.error("Error uploading image:", error);
          throw new Error(`Failed to upload image: ${error.message}`);
        }
  
        // Get the public URL for the uploaded file
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`; // disable cache in config
  
        imageUrls.push(publicUrl);
      }
  
      if (imageUrls.length === 0) {
        throw new Error("No valid images were uploaded");
      }
  
      // Add the car to the database
      const car = await db.car.create({
        data: {
          id: carId, // Use the same ID we used for the folder
          brand: carData.brand,
          model: carData.model,
          year: parseInt(carData.year, 10),
          price: carData.price,
          mileage: carData.mileage,
          color: carData.color,
          fuelType: carData.fuelType,
          transmission: carData.transmission,
          bodyType: carData.bodyType,
          seats: carData.seats,
          description: carData.description,
          status: carData.status,
          featured: carData.featured,
          images: imageUrls, // Store the array of image URLs
        },
      });
  
      // Revalidate the cars list page
      revalidatePath("/admin/cars");
  
      return {
        success: true,
      };
    } catch (error) {
      throw new Error("Error adding car:" + error.message);
    }
  }
  