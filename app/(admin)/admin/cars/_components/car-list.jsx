'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CarIcon, Search, SquarePlus } from 'lucide-react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CarForm from './car-form'
import React, { useState,useEffect } from 'react'
import useFetch from '@/hooks/use-fetch'
import { getCars,softDeleteCar,updateCarStatus } from '@/actions/car'
import { Card, CardContent} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'

const CarList = () => {
  
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const {
    loading:loadingCars,
    fn:fetchCars,
    data:carsData,
    error:carsError,  
  } = useFetch(getCars)

  const {
    loading:loadingSoftDelete,
    fn:softDelete,
    data:softDeleteData,
    error:softDeleteError,
  } = useFetch(softDeleteCar)

  const {
    loading:loadingUpdateStatus,
    fn:updateCar,
    data:updateStatusData,
    error:updateStatusError,
  } = useFetch(updateCarStatus)

  // Modal carousel state and handlers
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const openCarousel = (images) => {
    setCarouselImages(images);
    setCarouselIndex(0);
    setModalOpen(true);
  };

  const closeCarousel = () => {
    setModalOpen(false);
    setCarouselImages([]);
    setCarouselIndex(0);
  };

  const prevImage = () => {
    setCarouselIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  
  useEffect(()=>{
    fetchCars(search)
  },[search])

  useEffect(() => {
    if (carsData) {
      console.log("Cars Data:", carsData);
    }
  }, [carsData]);

  
  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
  }

  return (
    <>
      {/* Carousel Modal for pictures */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="relative rounded-lg shadow-lg p-4 max-w-lg w-full flex flex-col items-center bg-white/70 backdrop-blur border border-gray-300">
            <button
              className="absolute top-2 right-2 text-red-600 font-bold text-2xl hover:text-red-800"
              onClick={closeCarousel}
            >
              ✕
            </button>
            <div className="flex items-center justify-center w-full">
              <button
                className="p-2 text-3xl font-bold text-red-600 hover:text-red-800"
                onClick={prevImage}
                disabled={carouselImages.length <= 1}
              >
                &#8592;
              </button>
              <Image
                src={carouselImages[carouselIndex]}
                alt={`Car image ${carouselIndex + 1}`}
                width={400}
                height={300}
                className="object-contain rounded shadow"
              />
              <button
                className="p-2 text-3xl font-bold text-red-600 hover:text-red-800"
                onClick={nextImage}
                disabled={carouselImages.length <= 1}
              >
                &#8594;
              </button>
            </div>
            <div className="mt-2 text-center text-sm text-gray-700 font-semibold">
              {carouselIndex + 1} / {carouselImages.length}
            </div>
          </div>
        </div>
      )}

      <div className='space-y-4'>
        <div className="flex flex-row gap-4 items-center justify-between w-full">
          <form onSubmit={handleSearch} className="flex w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#171716]"/>
              <Input
                className="pl-9 w-full border border-[#171716] rounded-md focus:border-[#171716] focus:ring-2 focus:ring-[#171716]"
                placeholder="Search cars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
          <Button 
            onClick={() => setShowForm((prev) => !prev)}
            className='flex items-center gap-x-2 bg-[#171716] text-[#E8E0CF] hover:bg-[#991B1B] hover:text-[#E8E0CF] rounded-md ml-4'
          >
            {showForm ? <X className='w-4 h-4' /> : <SquarePlus className='w-4 h-4' />} {showForm ? 'Close' : 'Add Car'}
          </Button>
        </div>

        {/* Show CarForm inline when showForm is true */}
        {showForm && (
          <CarForm onClose={() => setShowForm(false)} />
        )}

          {/* Car List */}

          <Card className='border border-[#171716] rounded-md shadow-md bg-[#E8E0CF]'>
            <CardContent className='p-0'>
              {loadingCars && !carsData ?(
                <div className="flex justify-center items-center py-12">
                  <Loader2 className='w-4 h-4 animate-spin text-gray-500' />
                </div>
              ): carsData?.success && carsData.data.length > 0 ? (
                <div className="overflow-x-auto">

                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#171716]">
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Brand & Model</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {carsData.data.map((car)=>{
                      return(
                       <TableRow key={car.id} >
                          <TableCell className="w-10 h-10 rounded-md overflow-hidden border">
                            {car.images && car.images.length > 0 ? 
                            (
                              <Image
                                src={car.images[0]}
                                alt={car.brand + " " + car.model}
                                height={40}
                                width={40}
                                className="w-full h-full object-cover cursor-pointer"
                                priority
                                onClick={() => car.images.length > 0 && openCarousel(car.images)}
                              />
                            ):(
                              <div className ="w-full h-full bg-gray-200 flex items-center justify-center ">

                                <CarIcon className="w-6 h-6 text-gray-500" />
                              </div>  
                            )}
                          </TableCell>
                         
                       </TableRow>
                     )
                    })}
                  </TableBody>
                </Table> 
               </div>
              ):(
                <div></div>
              )
              
              }
            </CardContent>
          </Card>
      </div>
    </>
  )
}

export default CarList