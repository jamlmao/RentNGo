"use client"

import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from '@/components/ui/table';
import ImageCarouselModal from '@/components/ImageCarouselModal';
import useFetch from '@/hooks/use-fetch';
import Image from 'next/image';
import { getUserHistory } from '@/actions/history';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from '@/components/ui/input';

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const CarHistory = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;




  const { loading:loadingHistory, data: historyData, error: historyError, fn: fetchHistory } = useFetch(getUserHistory);

  const openCarousel = (images) => {
    setCarouselImages(images);
    setModalOpen(true);
  };

  const closeCarousel = () => {
    setModalOpen(false);
    setCarouselImages([]);
  };


  useEffect(() => {
    fetchHistory(search);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory(search);
  };

  useEffect(() => {
    console.log("History Data:", historyData);
    console.log("Loading State:", loadingHistory);
    console.log("Error State:", historyError);
  }, [historyData, loadingHistory, historyError]); // remove this after deployment



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyData?.data.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((historyData?.data.length || 0) / itemsPerPage);

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
    

      {/* main container */}
      <div className='space-y-4'>

          {/* search bar */}
          <div className="flex flex-row gap-4 items-center justify-between w-full mt-2">
            <form onSubmit={handleSearch} className="flex w-full max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#171716]"/>
                <Input
                  className="pl-9 w-full border border-[#171716] rounded-md focus:border-[#171716] focus:ring-2 focus:ring-[#171716]"
                  placeholder="Search history..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>



        
        <Card className='border border-[#171716] rounded-md shadow-md bg-[#E8E0CF]'>
          <CardContent>
            {loadingHistory && !historyData ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className='w-4 h-4 animate-spin text-gray-500' />
              </div>
            ) : historyData?.success && historyData.data.length > 0 ? (
              <div className="overflow-x-auto">
                   <Table>
                      <TableHeader>
                        <TableRow className="border-b border-[#171716] hover:bg-transparent">
                          <TableHead className="w-12"></TableHead>
                          <TableHead className="text-lg font-semibold text-center">Brand & Model</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Total Revenue</TableHead>
                          <TableHead className="text-lg font-semibold text-center">User</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Phone Number</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Address</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Rented At</TableHead>
                          <TableHead className="text-lg font-semibold text-center">Returned At</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((entry) => (
                          <TableRow key={entry.id} className="border-b border-[#171716] hover:bg-transparent">
                            <TableCell className="w-20 h-20 rounded-md overflow-hidden border-none">
                              <Image
                                src={entry.car.images[0]}
                                alt={`${entry.car.brand} ${entry.car.model}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover cursor-pointer"
                                priority  
                                onClick={() => openCarousel(entry.car.images)}
                              />
                            </TableCell>
                            <TableCell className="text-lg font-semibold text-center">{entry.car.brand} {entry.car.model}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">${entry.car.price}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{entry.user.name}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{entry.user.phoneNumber}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{entry.user.address}, {entry.user.city}, {entry.user.state}</TableCell>
                            <TableCell className="text-lg font-semibold text-center">{new Date(entry.rentedAt).toLocaleDateString()}</TableCell>  
                            <TableCell className="text-lg font-semibold text-center">{entry.returnDate ? new Date(entry.returnDate).toLocaleDateString() : 'N/A'}</TableCell>
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
                <p className='text-red-500'>No history data available.</p>
              </div>
            )}
          </CardContent>


        </Card>

      </div>




     
    </>
  );
};

export default CarHistory;

