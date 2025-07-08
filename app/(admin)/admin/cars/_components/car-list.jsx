'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, SquarePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React, { useState } from 'react'

const CarList = () => {
  
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
  }

  return (
    <div className='space-y-4'>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Button 
                onClick={() => router.push('/admin/cars/create')}
                className='flex items-center gap-x-2 bg-[#171716] text-[#E8E0CF] hover:bg-[#991B1B] hover:text-[#E8E0CF] rounded-md'
            >
                <SquarePlus className='w-4 h-4' /> Add Car
            </Button>


            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#171716]"/>
                    <Input
                      className="pl-9 w-full sm:w-64 border border-[#171716] rounded-md focus:border-[#171716] focus:ring-2 focus:ring-[#171716]"
                      placeholder="Search cars..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </form>
        </div>

        {/* Car List */}
    </div>
  )
}

export default CarList