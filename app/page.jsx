import { Button } from "@/components/ui/button";
import HomeSearch from "@/components/HomeSearch";
import { ChevronRight } from "lucide-react";
import { featuredCars } from "@/lib/data";
import CarCard from "@/components/CarCard";
import Link from "next/link";

export default function Home() {
  return (
   <div className="pt-20 flex flex-col">

    {/* Hero section */}
      <section className="relative py-16 md:py-28 dotted-background">
        <div className="max-w-4xl mx-auto text-center">
           <div className="mb-8">
           <h1 className="text-2xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#C62828] to-[#B0BEC5] text-transparent bg-clip-text tracking-tighter pr-2 pb-2">
                Welcome to Rent N' Go  Drive Luxury, Live Prestige.
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                RentNGo is a platform that allows you to rent luxury cars for your next trip.
              </p>
           </div>

          {/* Search bar */}
          <HomeSearch />            
        </div>
      </section>

    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold"> Featured Cars</h2>
          <Button variant='ghost' className='flex items-center hover:bg-black hover:text-white' asChild>
              <Link href="/cars">
                   View All <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

      </div>
    </section>

   </div>
  );
}
