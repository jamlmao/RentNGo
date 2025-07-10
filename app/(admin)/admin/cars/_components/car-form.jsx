"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useDropzone } from 'react-dropzone'
import { Trash, Upload } from 'lucide-react'
import { toast } from 'sonner'


const FuelType = ["Petrol", "Diesel", "Electric", "Hybrid"]
const Transmission = ["Manual", "Automatic"]
const BodyType = ["Sedan", "Hatchback", "SUV", "MPV", "Coupe", "Convertible"]
const CarStatus = ["AVAILABLE", "RENTEED", "RESERVED"]



const CarForm = () => {


  const [activeTab, setActiveTab] = useState("ai");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesError, setImagesError] = useState("");

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const carFormSchema = z.object({
    brand: z.string().min(1,"Brand is required"),
    model: z.string().min(1,"Model is required"),
    year: z.string().refine((val) => {
      const year = parseInt(val);
      return(
        !isNaN(year) && year >= 1900 && year <= new Date().getFullYear()
      );
    },{
      message: "Enter a valid year",
    }),
    price: z.number().min(0,"Price is required"),
    mileage: z.number().min(0,"Mileage is required"),
    color: z.string().min(1,"Color is required"),
    seats: z.number().optional(),
    fuelType: z.string().min(1,"Fuel Type is required"),
    transmission: z.string().min(1,"Transmission is required"),
    bodyType: z.string().min(1,"Body Type is required"),
    status: z.enum(["AVAILABLE","RENTED","RESERVED"]),
    description: z.string().min(10,"Description must be at least 10 characters"),
    featured: z.boolean().default(false),
    
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: "",
      price: "",
      mileage:"",
      color: "",
      seats: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      status: "AVAILABLE",
    }
  })


  const onSubmit = async(data)=> {
    if(uploadedImages.length === 0 ){
      setImagesError("At least one image is required");
      return;
    }
  }


  const onMultiImageDrop = (acceptedFiles) => {
     const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the size limit of 5MB`);
        return false;
      }
      return true;
     });


     if(validFiles.length === 0) return; // Only return if there are NO valid files

     const newImages = [] 
     validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(reader.result);

        if(newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setImagesError("");
          toast.success(`Successfully uploaded ${newImages.length} images`);
        }
      
      }

      reader.readAsDataURL(file);
     });
     


     
   }

   const {
    getRootProps:getMultiImageProps, 
    getInputProps:getMultiImageInputProps, } = useDropzone(
    {
      onDrop:onMultiImageDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
      multiple: true,
     });


  
  return (
  <div>
    <Tabs 
      defaultValue="ai" 
      onValueChange={setActiveTab}
      value={activeTab}
      className="mt-6"
    >
      <TabsList className="grid w-full grid-cols-2 bg-[#991B1B] text-[#E8E0CF] rounded-md">
        <TabsTrigger value="manual" className="data-[state=active]:bg-[#E8E0CF] data-[state=active]:text-[#171716] text-[#E8E0CF]">Car Details</TabsTrigger>
        <TabsTrigger value="ai" className="data-[state=active]:bg-[#E8E0CF] data-[state=active]:text-[#171716] text-[#E8E0CF]">Images</TabsTrigger>
      </TabsList>
      <TabsContent value="manual" className="mt-6">
        <Card className="bg-[#E8E0CF]  text-[#171716] rounded-md border-[#171716] shadow-2xl">
          <CardHeader>
            <CardTitle>Car Details</CardTitle>
            <CardDescription>Enter the details of the car</CardDescription>
            <CardAction>
              <Button>Save</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="Enter the brand of the car"
                    {...register("brand")}
                    className={cn(
                      "border rounded-md p-2 focus:ring-2",
                      errors.brand
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-sm">{errors.brand.message}</p>
                  )}
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="Enter the model of the car"
                    {...register("model")}
                    className={cn(
                      "border rounded-md p-2 focus:ring-2",
                      errors.model
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                  {errors.model && (
                    <p className="text-red-500 text-sm">{errors.model.message}</p>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    placeholder="Enter the year of the car"
                    {...register("year")}
                    className={cn(
                      "border rounded-md p-2 focus:ring-2",
                      errors.year
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm">{errors.year.message}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    placeholder="Enter the price of the car"
                    {...register("price")}
                    className={cn(
                      "border rounded-md p-2 focus:ring-2",
                      errors.price
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>

                {/* Mileage */}
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    placeholder="Enter the mileage of the car"
                    {...register("mileage")}  
                    className={cn(
                      "border rounded-md p-2 focus:ring-2",
                      errors.mileage
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                  {errors.mileage && (
                    <p className="text-red-500 text-sm">{errors.mileage.message}</p>
                  )}
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="Enter the color of the car"
                    {...register("color")}
                    className={cn(
                      "border rounded-md p-2 focus:ring-2",
                      errors.color
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                  {errors.color && (
                    <p className="text-red-500 text-sm">{errors.color.message}</p>
                  )}
                </div>

                    {/* Fuel Type */}
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={watch('fuelType')}
                    onValueChange={val => setValue('fuelType', val, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      id="fuelType"
                      className={cn(
                        "w-full border rounded-md p-2 focus:ring-2",
                        errors.fuelType
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                      )}
                    >
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FuelType.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuelType && (
                    <p className="text-red-500 text-sm">{errors.fuelType.message}</p>
                  )}
                </div>

                   {/* Transmission */}

                   <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select
                    value={watch('transmission')}
                    onValueChange={val => setValue('transmission', val, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      id="transmission"
                      className={cn(
                        "w-full border rounded-md p-2 focus:ring-2",
                        errors.transmission
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                      )}
                    >
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {Transmission.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.transmission && (
                    <p className="text-red-500 text-xs">{errors.transmission.message}</p>
                  )}
                 

                </div>

                  {/* Body Type */}
                <div className="space-y-2">
                  <Label htmlFor="bodyType">Body Type</Label>
                  <Select
                    value={watch('bodyType')}
                    onValueChange={val => setValue('bodyType', val, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      id="bodyType"
                      className={cn(
                        "w-full border rounded-md p-2 focus:ring-2",
                        errors.bodyType
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                      )}
                    >
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BodyType.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    {errors.bodyType && (
                    <p className="text-red-500 text-sm">{errors.bodyType.message}</p>
                  )}
                 

                </div>

                  {/* Seats */}
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats (Optional)</Label>
                  <Input
                    id="seats"
                    placeholder="Enter the number of seats in the car"
                    {...register("seats")}
                    className={cn(
                      "border rounded-md p-2 focus:ring-2",
                      errors.seats
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                  {errors.seats && (
                    <p className="text-red-500 text-sm">{errors.seats.message}</p>
                  )}
                </div>

                  {/* Car Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Car Status</Label>
                  <Select
                    value={watch('status')}
                    onValueChange={val => setValue('status', val, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      id="status"
                      className={cn(
                        "w-full border rounded-md p-2 focus:ring-2",
                        errors.status
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                      )}
                    >
                      <SelectValue placeholder="Select car status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CarStatus.map(type => (
                        <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    {errors.status && (
                    <p className="text-red-500 text-sm">{errors.status.message}</p>
                  )}
                 

                </div>                
              </div>
                  {/*Description */}
                  <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter the description of the car"
                    {...register("description")}  
                    className={cn(
                      "border rounded-md p-2 focus:ring-2 min-h-32",
                      errors.description
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                    )}
                  />
                    {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>
            

                <div className="flex items-center space-x-3 space-y-0 border border-[#171716] rounded-md  p-4">
                  <Checkbox 
                    id="featured"
                    className="border-[#171716]"
                    checked={watch('featured')}
                    onCheckedChange={val => setValue('featured', val, { shouldValidate: true })}
                  />
                  <div className="space-y-1 leading-none">
                    <Label>Featured</Label>
                    <p className="text-xs text-gray-500">Featured cars will be displayed on the home page</p>
                  </div>
                </div>

              <div>
                <Label 
                  htmlFor="images"
                  className={cn("mb-2", imagesError && "text-red-500")}
                >
                  Images {" "}
                  {imagesError && <span className="text-red-500">*</span>}
                </Label>


                {/* Dropzone */}
                <div 
                  {...getMultiImageProps()} 
                    className={`border-2 border-gray-500 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-[#E8E0CF] transition-colors duration-200
                    ${imagesError ? "border-red-500" : "border-gray-500"}`
                  }
                >
                  <input {...getMultiImageInputProps()} />
                  <div className="flex flex-col items-center justify-center ">
                    <Upload
                      className="text-gray-500 mb-2 h-12 w-12 text-gray-500 mb-2"
                    />
                    <p className="text-sm font-medium  text-gray-600">
                        Drag and drop your image here or click to upload
                      
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PNG, JPG, JPEG, WEBP (max 5MB each)
                    </p>
                  </div>
                 
                </div>
                {imagesError && (
                    <p className="text-red-500 text-sm mt-1">{imagesError}</p>   
                )}
              </div>
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Uploaded Images</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Uploaded Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                        <Button 
                          className="absolute top-2 right-2 hover:bg-[#991B1B]  border-none px-2 py-1 rounded-md text-xs text-[#faf7e3] transition"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
              )}
            </form>
          </CardContent>
         
        </Card>
      </TabsContent>
      <TabsContent value="ai" className="mt-6">
        Change your password here.
      </TabsContent>
    </Tabs>
  </div>
  )
}

export default CarForm  