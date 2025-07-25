
import React from 'react'
import CarHistory from './_components/car-history'


export const metadata ={
    title:"Car User History",
    description:"View all the cars that have been rented by users"
}

const HistoryPage = () => {
  return (
    <div className='p-4'>
        <h1 className='text-2xl font-bold'>Car User History</h1>
        <CarHistory />
    </div>
  )
}

export default HistoryPage