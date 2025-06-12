"use client"

import React from 'react'
import { Card, CardHeader, CardTitle,CardContent } from './ui/card'
import Image from 'next/image';
import { Heart, CarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';

const CarCard = ({car}) => {
   const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);
   const handleWishlist = (e) => {}
   const router = useRouter();
  return (
    <Card className='overflow-hidden border-none hover:shadow-lg transition group py-0 bg-[#171716]'>
       <div className='relative w-full h-50'> 
        {car.images && car.images.length > 0? (
            <div className='relative w-full h-full'>
                <Image 
                    src={car.images[0]} 
                    alt={`${car.brand} ${car.model}`} 
                    fill 
                    className='object-contain group-hover:scale-105 transition duration-300 ' 
                    
                />
            </div>
        ):(
         <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CarIcon className = "h-12 w-12 text-gray-400"/>
         </div>
        )}

        <Button
             variant="ghost" 
            className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5
             ${isWishlisted ? "bg-[#E8E0CF]" : "bg-[#E8E0CF]"}`}
            onClick={handleWishlist}
        >
            <Heart className={isWishlisted ? "fill-current text-[#991B1B]" : "text-gray-500"} size={20} />
        </Button>
       </div>

       <CardContent className='p-4'>
        <div className='flex flex-col mb-2'>
            <h3 className='text-lg font-bold line-clamp-1 text-[#f5f1dd]'>{car.brand} {car.model}</h3>
            <span className='text-xl font-bold text-[#f5f1dd]'>${car.price.toLocaleString()}</span>
        </div>

        <div className="text-gray-600 mb-2 flex items-center ">
            <span className='text-sm text-[#f5f1dd]'>{car.year}</span>
            <span className='mx-2'>•</span>
            <span className='text-sm text-[#f5f1dd]'>{car.transmission}</span>
            <span className='mx-2'>•</span>
            <span className='text-sm text-[#f5f1dd]'>{car.fuelType}</span>
           
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="outline" className='bg-[#E8E0CF]'>{car.bodyType}</Badge>
            <Badge variant="outline" className='bg-[#E8E0CF]'>{car.mileage.toLocaleString()} km</Badge>
            <Badge variant="outline" className='bg-[#E8E0CF]'>{car.color}</Badge>
        </div>

        <div className='flex justify-end'>
            <Button 
                className='flex-1 text-[#f5f1dd] bg-[#991B1B]'
                onClick={() => router.push(`/cars/${car.id}`)}>
                    View Details
            </Button>
        </div>
       </CardContent>
    </Card>
  )
}

export default CarCard