
// Helper function to serialize car data based on schema columns
export const CarData = (car, wishlisted = false, rented = false) => {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price ? parseFloat(car.price.toString()) : 0,
    mileage: car.mileage,
    fuelType: car.fuelType,
    transmission: car.transmission,
    color: car.color,
    seats: car.seats,
    bodyType: car.bodyType,
    description: car.description,
    featured: car.featured,
    images: car.images,
    status: car.status,
    createdAt: car.createdAt?.toISOString(),
    updatedAt: car.updatedAt?.toISOString(),
    wishlisted,
    rented,
  };
};



export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}