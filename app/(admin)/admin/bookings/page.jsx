import React from 'react'
import BookingList from './_components/booking-list'

export const metadata ={
    title:"Admin - Bookings",
    description:"View all the bookings"
}

const BookingPage = () => {
  return (
    <div className='p-4'>
        <h1 className='text-2xl font-bold'>Bookings</h1>
        <BookingList />
    </div>
  )
}

export default BookingPage