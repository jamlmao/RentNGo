"use client"
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Camera, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const HomeSearch = () => {
   const [searchText, setSearchText] = useState("");
   const [isImageSearchActive, setIsImageSearchActive] = useState(false);
   const [imagePreview, setImagePreview] = useState("");
   const [searchImage, setSearchImage] = useState(null);
   const [isUploading, setIsUploading] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
   const router = useRouter();

   const handleTextSubmit = (e) => {
    e.preventDefault();
    if(!searchText.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    router.push(`/cars?search=${encodeURIComponent(searchText)}`);
   }
   const handleImageSubmit = async(e) => {
      e.preventDefault();
      if(!searchImage) {
        toast.error("Please upload an image");
        return;
      }
     

   }

   const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if(file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSearchImage(file);
      setIsUploading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      }

      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to upload image");
      }

      reader.readAsDataURL(file);

    }

   }

   const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone(
    {
      onDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
      maxFiles: 1,
     });




  
  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <div className="relative flex items-center">
          <Input 
            type="text"
            placeholder="Enter car brand,model, or use AI Image Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 pr-12 py-6 w-full rounded-full border-[#E8E0CF] bg-[#E8E0CF] text-[#171716] placeholder:text-[#171716] placeholder:opacity-50"
          />
          <div className="absolute right-[90px]">
            <Camera 
              size={35}
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className="cursor-pointer rounded-xl p-1.5"
              style={{
                backgroundColor: isImageSearchActive ? "#171716" : "#E8E0CF",
                color: isImageSearchActive ? "#E8E0CF" : "#171716",
              }}
            />
          </div>
          <Button type="submit" className="absolute right-2 rounded-full"> Search</Button>
        </div>
      </form>

      {isImageSearchActive && (
        <div className="mt-4">
          <form onSubmit={handleImageSubmit}>
            <div className="border-2 border-dashed border-[#E8E0CF] rounded-3xl p-6 text-center">
              {imagePreview?( 
                <div className="flex flex-col items-center">
                  <img  
                    src={imagePreview}
                    alt="Image Preview"
                    className="h-40 object-contain mb-4"
                  
                  />
                  <Button
                    className="bg-[#E8E0CF] text-[#171716] hover:bg-[#991B1B] hover:text-[#E8E0CF] hover:border-[#171716] "
                    variant="outline"
                    onClick={() => {
                      setImagePreview("");
                      setSearchImage(null);
                      toast.info("Image removed successfully");
                    
                    }}
                  >Remove Image</Button>

                </div> 
              ):(
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center ">
                    <Upload
                      className="text-gray-500 mb-2 h-12 w-12 text-gray-500 mb-2"
                    />
                    <p className="text-lg font-medium  text-gray-500">
                      {isDragActive && !isDragReject
                        ?" Drop your image here ... "
                        :  "Drag and drop your image here or click to upload"
                      }
                    </p>
                    {isDragReject && (
                      <p className="text-red-500 mb-2">
                        Only images (png, jpg, jpeg, webp) are allowed
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: PNG, JPG, JPEG, WEBP (max 5MB)
                    </p>
                  </div>
                 
                </div>
              )}
            </div>
            {imagePreview && (
              <Button type="submit" className="w-full mt-2 bg-[#E8E0CF] text-[#171716] hover:bg-[#991B1B] hover:text-[#E8E0CF] hover:border-[#171716] " disabled={isUploading || isProcessing}>
                {isUploading ? "Uploading..." : "Search Image"}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

export default HomeSearch