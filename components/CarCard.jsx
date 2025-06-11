"use client"

import React from 'react'
import { Card, CardHeader, CardTitle,CardContent } from './ui/card'
import Image from 'next/image';
import { Heart, CarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

const CarCard = ({car}) => {
   const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);
   const handleWishlist = (e) => {}
  return (
    <Card className='overflow-hidden hover:shadow-lg transition group'>
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
             ${isWishlisted ? "bg-red-500" : "bg-white"}`}
            onClick={handleWishlist}
        >
            <Heart className={isWishlisted ? "fill-current text-white" : "text-gray-500"} size={20} />
        </Button>
       </div>

       <CardContent className='p-4'>
        <div className='flex flex-col mb-2'>
           
            <h3 className='text-lg font-bold line-clamp-1'>{car.brand} {car.model}</h3>
            <span className='text-xl font-bold text-[#1A1A1A]-600'>${car.price.toLocaleString()}</span>
            
        </div>
       </CardContent>
    </Card>
  )
}

export default CarCard