import { Button } from "@/components/ui/button";
import HomeSearch from "@/components/HomeSearch";

export default function Home() {
  return (
   <div className="pt-20 flex flex-col">

    {/* Hero section */}
      <section className="relative py-16 md:py-28 dotted-background">
        <div className="max-w-4xl mx-auto text-center">
           <div className="mb-8">
           <h1 className="text-2xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#C62828] to-[#B0BEC5] text-transparent bg-clip-text tracking-tighter pr-2 pb-2">
                Welcome to Rent N' Go  Drive Luxury, Live Prestige.
              </h1>
              <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                RentNGo is a platform that allows you to rent luxury cars for your next trip.
              </p>
           </div>

          {/* Search bar */}
          <HomeSearch />            
        </div>
      </section>

    

   </div>
  );
}
