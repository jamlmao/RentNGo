'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SquarePlus } from 'lucide-react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CarForm from './car-form'
import React, { useState } from 'react'

const CarList = () => {
  
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
  }

  return (
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
        <div className="my-4">
          <CarForm />
        </div>
      )}

        {/* Car List */}
    </div>
  )
}

export default CarList