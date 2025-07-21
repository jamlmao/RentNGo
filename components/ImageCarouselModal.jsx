'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const ImageCarouselModal = ({ 
  isOpen, 
  images = [], 
  onClose, 
  title = "Image Gallery",
  maxWidth = "max-w-lg"
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Reset index when modal opens with new images
  React.useEffect(() => {
    if (isOpen && images.length > 0) {
      setCarouselIndex(0);
    }
  }, [isOpen, images]);

  const prevImage = () => {
    setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, images.length]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative rounded-lg shadow-xl p-4 ${maxWidth} w-full flex flex-col items-center bg-white/90 backdrop-blur border border-gray-300`}>
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            className="text-red-600 font-bold text-2xl hover:text-red-800 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Image Container */}
        <div className="flex items-center justify-center w-full">
          <button
            className="p-2 text-3xl font-bold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={prevImage}
            disabled={images.length <= 1}
            aria-label="Previous image"
          >
            &#8592;
          </button>
          
          <div className="mx-4 relative">
            <Image
              src={images[carouselIndex]}
              alt={`Image ${carouselIndex + 1} of ${images.length}`}
              width={400}
              height={300}
              className="object-contain rounded shadow-lg max-h-96"
              priority
            />
          </div>
          
          <button
            className="p-2 text-3xl font-bold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={nextImage}
            disabled={images.length <= 1}
            aria-label="Next image"
          >
            &#8594;
          </button>
        </div>

        {/* Image Counter */}
        <div className="mt-4 text-center text-sm text-gray-700 font-semibold">
          {carouselIndex + 1} / {images.length}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 flex-wrap justify-center max-w-full">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCarouselIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                  index === carouselIndex 
                    ? 'border-red-600 scale-110' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarouselModal; 