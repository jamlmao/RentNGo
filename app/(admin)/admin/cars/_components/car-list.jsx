'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CarIcon, EllipsisVertical, Eye, Search, SquarePlus, Star, StarOff, Trash2 } from 'lucide-react'
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
import { formatCurrency } from '@/lib/helper'
import ImageCarouselModal from '@/components/ImageCarouselModal'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const CarList = () => {
  
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteCar,setDeleteCar] = useState(null);
  const [deleteModalOpen,setDeleteModalOpen] = useState(false);

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
    fn:updateCarFn,
    data:updateStatusData,
    error:updateStatusError,
  } = useFetch(updateCarStatus)

  // Modal carousel state and handlers
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);

  const openCarousel = (images) => {
    setCarouselImages(images);
    setModalOpen(true);
  };

  const closeCarousel = () => {
    setModalOpen(false);
    setCarouselImages([]);
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
    fetchCars(search)
  }

 

  useEffect(()=>{

    if(softDeleteData?.success){
      toast.success("Car deleted successfully")
      fetchCars(search)
    }
    
    if(updateStatusData?.success){
      toast.success("Car status updated successfully")
      fetchCars(search)
    }
  },[updateStatusData,softDeleteData])


  ///handle errors
  useEffect(()=>{
    if (carsError){
      toast.error("Error fetching cars")
    }
    if(softDeleteError){
      toast.error("Error deleting car")
    }
    if(updateStatusError){
      toast.error("Error updating car status")
    }
  },[carsError,softDeleteError,updateStatusError])

  const handleFeatured = async(car)=>{
    await updateCarFn(car.id, {featured: !car.featured})

  }


  const handleStatus = async(car, newStatus)=>{
    await updateCarFn(car.id, {status: newStatus})

  }


  const handleDelete = async(car)=>{
     if(!car) return;
      await softDelete(car.id)
 
      setDeleteCar(null)
      setDeleteModalOpen(false)
  } 


  const statusBadge = (status) => {
    switch(status){
      case 'AVAILABLE':
        return <Badge className='bg-green-100 text-green-800 border-none hover:bg-green-200'>Available</Badge>
      case 'RENTED':
        return <Badge className='bg-red-100 text-red-800 border-none hover:bg-red-200'>Rented</Badge>
      case 'RESERVED':
        return <Badge className='bg-blue-100 text-blue-800 border-none hover:bg-blue-200'>Reserved</Badge>
      default:
        return <Badge className='bg-gray-100 text-gray-800 border-none hover:bg-gray-200'>{status}</Badge>
    }
  }



  return (
    <>
      {/* Carousel Modal for pictures */}
      <ImageCarouselModal
        isOpen={modalOpen}
        images={carouselImages}
        onClose={closeCarousel}
        title="Car Gallery"
      />

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
                    <TableRow className="border-b border-[#171716] hover:bg-transparent">
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="text-lg font-semibold text-center">Brand & Model</TableHead>
                      <TableHead className="text-lg font-semibold text-center">Year</TableHead>
                      <TableHead className="text-lg font-semibold text-center">Price</TableHead>
                      <TableHead className="text-lg font-semibold text-center">Status</TableHead>
                      <TableHead className="text-lg font-semibold text-center">Featured</TableHead>
                      <TableHead className="text-lg font-semibold text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {carsData.data.map((car)=>{
                      return(
                       <TableRow key={car.id} className="border-b border-[#171716] hover:bg-transparent">
                          <TableCell className="w-20 h-20 rounded-md overflow-hidden border-none">
                            {car.images && car.images.length > 0 ? 
                            (
                              <Image
                                src={car.images[0]}
                                alt={car.brand + " " + car.model}
                                height={100}
                                width={100}
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
                          <TableCell className="text-center">{car.brand + " " + car.model}</TableCell>
                          <TableCell className="text-center">{car.year}</TableCell>
                          <TableCell className="text-center">{formatCurrency(car.price)}</TableCell>
                          <TableCell className="text-center">{statusBadge(car.status)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                             variant= "ghost"
                             className='p-0'
                             size="sm"
                             onClick={()=>handleFeatured(car)}
                             disabled={loadingUpdateStatus}
                            >
                              {car.featured ? (
                                  <Star className='w-4 h-4 text-amber-500 fill-amber-500' />
                                ) : (
                                  <StarOff className='w-4 h-4 text-gray-500' />
                              )}
                            </Button>
                           
                          </TableCell>  
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                 variant="ghost"
                                 className='p-0 h-8 w-8'
                                 size="sm"
                                >
                                  <EllipsisVertical className='w-4 h-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={()=> router.push(`/cars/${car.id}`)}
                                >
                                  <Eye className='w-4 h-4 mr-2' />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={()=>
                                    handleStatus(car, "AVAILABLE")
                                  }
                                  disabled={
                                    car.status === "AVAILABLE" || loadingUpdateStatus
                                  }
                                
                                >Set Available</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={()=>
                                    handleStatus(car, "RENTED")
                                  }
                                  disabled={
                                    car.status === "RENTED" || loadingUpdateStatus
                                  }
                                >Set Rented</DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={()=>
                                    handleStatus(car, "RESERVED")
                                  }
                                  disabled={
                                    car.status === "RESERVED" || loadingUpdateStatus
                                  }
                                >Set Reserved</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className='text-red-500'
                                  onClick={()=>{
                                    setDeleteCar(car)
                                    setDeleteModalOpen(true)
                                  }}
                                  disabled={loadingSoftDelete}
                                >
                                  <Trash2 className='w-4 h-4 mr-2' />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                         
                       </TableRow>
                     )
                    })}
                  </TableBody>
                </Table> 
               </div>
              ):(
                <div className='flex flex-col items-center justify-center py-12 px-4 text-center'>
                  <CarIcon className='h-12 w-12 text-gray-500 mb-4' />
                  <h3 className='text-lg font-medium text-[#171716]'>No cars found</h3>
                  <p className='text-sm text-gray-500'>
                    {search
                      ? "No cars match your search"
                      : "No cars available yet. Add a car to get started."
                    }
                  </p>
                </div>
              )
              
              }
            </CardContent>
          </Card>


          <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogContent className='bg-[#E8E0CF] text-[#171716] shadow-md border border-[#171716]'>
              <DialogHeader>
                <DialogTitle>Delete Car</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete <span className="font-bold">{deleteCar?.brand}{" "}{deleteCar?.model}{" "}({deleteCar?.year})</span>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  className='bg-gray-200'
                  onClick={()=>setDeleteModalOpen(false)}
                  disabled={loadingSoftDelete}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={()=>handleDelete(deleteCar)}
                  disabled={loadingSoftDelete}
                >
                  {loadingSoftDelete ? (
                    <> 
                     <Loader2 className='w-4 h-4 animate-spin' /> 
                      Deleting...
                    </> 
                  ):(
                    <>
                      Delete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </div>
    </>
  )
}

export default CarList