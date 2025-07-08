import React from 'react'
import CarList from './_components/car-list'

export const metadata = {
  title: 'Admin - Cars',
  description: 'Manage cars',
}


const CarPage = () => {
  return (
    <div className='p-4'>
      <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
      <CarList />
    </div>
  )
}

export default CarPage