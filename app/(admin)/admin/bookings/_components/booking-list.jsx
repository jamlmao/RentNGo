"use client"

import React, { useState, useEffect } from 'react'
import { getBookings } from '@/actions/booking'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

const BookingList = () => {
    const [search, setSearch] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
    }

  return (
    <>
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



            <Card className='border border-[#171716] rounded-md shadow-md bg-[#E8E0CF]'>

            </Card>
         </div>
    </>
   
  )
}

export default BookingList