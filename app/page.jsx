import { Button } from "@/components/ui/button";
import HomeSearch from "@/components/HomeSearch";
import { BookCheck, Car, ChevronRight, CircleDollarSign } from "lucide-react";
import { featuredCars, carMakes, bodyTypes, faqItems } from "@/lib/data";
import CarCard from "@/components/CarCard";
import Link from "next/link";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
   <div className="pt-20 flex flex-col">

    {/* Hero section */}
      <section className="relative py-16 md:py-28 dotted-background">
        <div className="max-w-4xl mx-auto text-center">
           <div className="mb-8">
           <h1 className="text-2xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#991B1B] to-[#E8E0CF] text-transparent bg-clip-text tracking-tighter pr-2 pb-2">
                Welcome to Rent N' Go  Drive Luxury, Live Prestige.
              </h1>
              <p className="text-xl text-[#f7f5eb] mb-8 max-w-2xl mx-auto">
                RentNGo is a platform that allows you to rent luxury cars for your trips.
              </p>
           </div>

          {/* Search bar */}
          <HomeSearch />            
        </div>
      </section>

    <section className="py-12 bg-[#E8E0CF]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#171716]"> Featured Cars</h2>
          <Button  className='flex items-center hover:bg-[#171716] hover:text-[#E8E0CF] bg-[#991B1B]' asChild>
              <Link href="/cars">
                   View All<ChevronRight className="ml-1 w-4 h-4" />
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



    <section className="py-12 dotted-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#E8E0CF]">Car Brands</h2>
          <Button  className='flex items-center hover:bg-[#171716] hover:text-[#E8E0CF] bg-[#991B1B]' asChild>
              <Link href="/cars">
                   View All <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {carMakes.map((brand) => {
            return (
            <Link 
              key={brand.name}
              href={`/cars?brand=${brand.name}`}
              className="bg-[#E8E0CF] rounded-lg shadow-lg p-4 text-center  hover:shadow-red-500 hover:scale-105 transition cursor-pointer">

              <div className="h-16 w-auto mx-auto mb-2 relative">
                <Image src={brand.image} 
                  alt={brand.name}
                  fill
                  className="w-full h-full object-contain"/>
              </div>  
              <h3 className="text-lg font-medium text-[#171716]">{brand.name}</h3>


            </Link>
          )})}
        </div>

      </div>
    </section>

    <section className="py-16 dotted-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-12 text-[#E8E0CF]">Why Choose Us?</h2>

        {/* Why choose us */}
        <div className="grid grid-cols-1 md:grid-cols-3  gap-8">
          <div className="text-center">
            <div className="bg-[#991B1B] text-[#E8E0CF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-[#E8E0CF]" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[#E8E0CF]">Wide Selection</h3>
            <p className="text-[#E8E0CF]">We offer a wide selection of cars to choose from, so you can find the perfect car for your needs.</p>
          </div>

          <div className="text-center">
            <div className="bg-[#991B1B] text-[#E8E0CF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookCheck className="h-8 w-8 text-[#E8E0CF]" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[#E8E0CF]">Best Prices</h3>
            <p className="text-[#E8E0CF]">We offer the best prices in the market, so you can save money on your car rental.</p>
          </div>


          <div className="text-center">
            <div className="bg-[#991B1B] text-[#E8E0CF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CircleDollarSign className="h-8 w-8 text-[#E8E0CF]" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[#E8E0CF]">Easy Booking</h3>
            <p className="text-[#E8E0CF]">Booking a car is easy and fast, you can do it in a few clicks.</p>
          </div>

         
          
        </div>
      </div>
    </section>





    <section className="py-12 bg-[#E8E0CF]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Available Cars</h2>
          <Button  className='flex items-center hover:bg-[#171716] hover:text-[#E8E0CF] bg-[#991B1B]' asChild>
              <Link href="/cars">
                   View All <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bodyTypes.map((bodyType) => {
            return (
            <Link 
              key={bodyType.name}
              href={`/cars?bodyType=${bodyType.name}`}
              className="relative group cursor-pointer"
            >
              <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                <Image
                  src={bodyType.image}
                  alt={bodyType.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay */}
                <h3 className="absolute inset-0 bg-gradient-to-t from-[#E8E0CF] to-transparent text-center text-lg font-medium text-[#171716] p-2 rounded-lg flex items-end transition-opacity duration-300 group-hover:opacity-0">
                  {bodyType.name}
                </h3>
              </div>
            </Link>
          )})}
        </div>

      </div>
    </section>
    

    <section className="py-12 bg-[#E8E0CF]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full ">
          {faqItems.map((faq,index) => {
            return (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#171716]">
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ) 
          })}
        </Accordion>

      </div>
    </section>
    

    <section className="py-16 dotted-background text-[#E8E0CF]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-center mb-8 ">Ready to Rent a Car?</h2>
        <p className="text-center mb-8 text-[#E8E0CF]">Book your car rental today and experience the freedom of the open road.</p>
       <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" className="bg-[#991B1B] text-[#E8E0CF] hover:bg-[#E8E0CF] hover:text-[#171716]" asChild>
            <Link href="/cars"> Book Now </Link>
          </Button>
          <SignedOut>
            <Button size="lg" variant="secondary" className="bg-[#991B1B] text-[#E8E0CF] hover:bg-[#E8E0CF] hover:text-[#171716]" asChild>
              <Link href="/sign-up"> Book Now </Link>
            </Button>
          </SignedOut>
       </div>
      </div>
    </section>


   </div>
  );
}
