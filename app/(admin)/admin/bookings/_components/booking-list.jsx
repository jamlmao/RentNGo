"use client"

import React, { useState, useEffect } from 'react'
import { getBookings } from '@/actions/booking'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import ImageCarouselModal from '@/components/ImageCarouselModal';
import { AlertCircle, Loader2, Search, EllipsisVertical } from 'lucide-react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from '@/components/ui/table';
import useFetch from '@/hooks/use-fetch';
import Image from 'next/image'; 
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/helper'
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button';

const BookingList = () => {
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [carouselImages, setCarouselImages] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSearch = (e) => {
        e.preventDefault()
    }

    const openCarousel = (images) => {
      setCarouselImages(images);
      setModalOpen(true);
    };
  
    const closeCarousel = () => {
      setModalOpen(false);
      setCarouselImages([]);
    };

    const { loading:loadingBookings, data: bookingsData, error: bookingsError, fn: fetchBookings } = useFetch(getBookings);


    useEffect(()=>{
      console.log("Bookings Data: ", bookingsData)
    },[])

    useEffect(()=>{
      fetchBookings(search)
    },[search])

    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookingsData?.data ? bookingsData.data.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Math.ceil((bookingsData?.data?.length || 0) / itemsPerPage);
  
    const handlePageChange = (page) => {  
      setCurrentPage(page);
    };
  




  return (
    <>
        <ImageCarouselModal
        isOpen={modalOpen}
        images={carouselImages}
        onClose={closeCarousel}
        title="Car Gallery"
      />   
    
         <div className='space-y-4'>

              {/* search bar */}
          <div className="flex flex-row gap-4 items-center justify-between w-full mt-2">
            <form onSubmit={handleSearch} className="flex w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#171716]"/>
                <Input
                  className="pl-9 w-full border border-[#171716] rounded-md focus:border-[#171716] focus:ring-2 focus:ring-[#171716]"
                  placeholder="Search bookings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>

            {/* booking list */}

             <Card className='border border-[#171716] rounded-md shadow-md bg-[#E8E0CF]'>
          <CardContent>
            {loadingBookings  ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className='w-4 h-4 animate-spin text-gray-500' />
              </div>
            ) : bookingsData?.success && bookingsData.data.length > 0 ? (
              <div className="overflow-x-auto">
                   <Table>
                      <TableHeader>
                        <TableRow className="border-b border-[#171716] hover:bg-transparent">
                          <TableHead className="w-12"></TableHead>
                          <TableHead className="text-lg font-semibold text-center">Brand & Model</TableHead>
                          
                          <TableHead className="text-lg font-semibold text-center">User</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Phone Number</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Address</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Start Date</TableHead>
                          <TableHead className="text-lg font-semibold text-center">End Date</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Total Revenue</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Status</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((item) => (
                          <TableRow key={item.id} className="border-b border-[#171716] hover:bg-transparent">
                            <TableCell className="w-20 h-20 rounded-md overflow-hidden border-none">
                              <Image
                                src={item.car.images[0]}
                                alt={`${item.car.brand} ${item.car.model}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover cursor-pointer"
                                priority  
                                onClick={() => openCarousel(item.car.images)}
                              />
                            </TableCell>
                            <TableCell className="text-lg font-semibold text-center">{item.car.brand} {item.car.model}</TableCell>
                            
                            <TableCell className="text-lg font-semibold text-center">{item.user.name}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{item.user.phoneNumber}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{item.user.address}, {item.user.city}, {item.user.state}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{new Date(item.startDate).toLocaleDateString()}</TableCell>  
                            <TableCell className="text-lg font-semibold text-center">{new Date(item.endDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{formatCurrency(item.totalPrice)}</TableCell>
                            <TableCell className="text-lg font-semibold text-center"><Badge className='bg-blue-100 text-blue-800 border-none hover:bg-blue-200'>{item.car.status}</Badge></TableCell>
                            <TableCell className="text-lg font-semibold text-center">
                              <Button 
                                 variant="ghost"
                                 className='p-0 h-8 w-8'
                                 size="sm">
                                <EllipsisVertical className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>  
                    </Table>
                      <Pagination className='flex justify-center items-center py-4'>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} className='bg-[#171716] text-white' />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                              <PaginationLink
                                onClick={() => handlePageChange(index + 1)}
                                isActive={currentPage === index + 1}
                                className='bg-[#E8E0CF] text-[#171716] border border-[#171716]'
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} className='bg-[#171716] text-white' />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
              </div>
            ) : (
              <div className="flex justify-center items-center py-12">
                <AlertCircle className='w-4 h-4 text-red-500 mr-2' />
                <p className='text-red-500'>No bookings data available.</p>
              </div>
            )}
          </CardContent>


        </Card>
         </div>
    </>
   
  )
}

export default BookingList