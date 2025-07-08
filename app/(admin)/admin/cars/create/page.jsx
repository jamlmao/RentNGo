import React from 'react'
import CarForm from '../_components/car-form'

const metadata = {
  title: 'Add Car | Admin',
  description: 'Add a new car to the database',
}

const AddCar = () => {
  return (
    <div className='p-4'>
      <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
      <CarForm />
    </div>
  )
}

export default AddCar