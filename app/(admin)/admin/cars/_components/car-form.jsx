"use client"

import React, { useEffect, useState } from 'react'
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
import { Trash, Upload, Loader2, Camera, X } from 'lucide-react'
import { toast } from 'sonner'
import useFetch from '@/hooks/use-fetch'
import { createCar, CarImageWithAI } from '@/actions/car'
import { useRouter } from 'next/navigation'


const FuelType = ["Petrol", "Diesel", "Electric", "Hybrid"]
const Transmission = ["Manual", "Automatic"]
const BodyType = ["Sedan", "Hatchback", "SUV", "MPV", "Coupe", "Convertible"]
const CarStatus = ["AVAILABLE", "RENTED", "RESERVED"]


function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Utility function to resize image before upload
async function resizeImage(file, maxWidth = 1024) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((maxWidth / width) * height);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, 0.9);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


const CarForm = ({ onClose }) => {

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("ai");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesError, setImagesError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedAiImage, setUploadedAiImage] = useState(null);
  const [isUploadingAi, setIsUploadingAi] = useState(false);


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
    seats: z.preprocess(
      (val) => {
        if (val === "" || val === null || typeof val === "undefined" || Number.isNaN(val)) return null;
        return Number(val);
      },
      z.number().nullable().optional()
    ),
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
    reset,
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



  const {
    data:createCarData,
    loading:createCarLoading, 
    error:createCarError, 
    fn:createCarFn 
  } = useFetch(createCar)

  useEffect(()=>{
    if(createCarData?.success){
      toast.success("Car created successfully");
      onClose && onClose(); // <-- Close the form
      reset();  
    }
   
  },[createCarData])


  const onSubmit = async(data)=> {
    if(uploadedImages.length === 0 ){
      setImagesError("At least one image is required");
      return;
    }

    const carData = {
      ...data,
      brand: capitalizeFirst(data.brand),
      model: capitalizeFirst(data.model),
      color: capitalizeFirst(data.color),
      description: capitalizeFirst(data.description),
      price: parseInt(data.price),
      mileage: parseInt(data.mileage),
      seats: data.seats,
    }


    await createCarFn({
      carData,
      Images: uploadedImages,
    });

    console.log(carData);
    
  }


  const onMultiImageDrop = (acceptedFiles) => {
     const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the size limit of 10MB`);
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



     const onAiImageDrop = async (acceptedFiles) => {
      const file = acceptedFiles[0];
  
      if(file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Image size must be less than 10MB");
          return;
        }
  
        setIsUploadingAi(true);
        // Resize image if needed
        let processedFile = file;
        try {
          const resizedBlob = await resizeImage(file, 1024);
          if (resizedBlob && resizedBlob.size < file.size) {
            processedFile = new File([resizedBlob], file.name, { type: file.type });
            console.log(`[Client] Image successfully resized: original size = ${file.size} bytes, resized size = ${processedFile.size} bytes`);
          } else {
            console.log("[Client] Image not resized (already small enough or resize failed)");
          }
        } catch (err) {
          // fallback to original file if resize fails
          processedFile = file;
          console.log("[Client] Image resize failed, using original file.", err);
        }
        setUploadedAiImage(processedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
          setIsUploadingAi(false);
          toast.success("Image uploaded successfully");
        };
        reader.readAsDataURL(processedFile);
      }
  
     }

     const {
      getRootProps:getAiImageProps, 
      getInputProps:getAiImageInputProps, } = useDropzone(
      {
        onDrop:onAiImageDrop,
        accept: {
          "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
        multiple: false,
       });

  
      {/* AI Image Extraction */}
      const {
        data:aiImageData,
        loading:aiImageLoading,
        error:aiImageError,
        fn:aiImageFn
      } = useFetch(CarImageWithAI)
      
      const processAiImage = async()=>{

        if(!uploadedAiImage){
          toast.error("Please upload an image first");
          return;
        }

        setIsUploadingAi(true);
        console.log("[AI Extraction] Starting extraction...");
        await aiImageFn(uploadedAiImage);
        console.log("[AI Extraction] Waiting for AI response...");

        if(aiImageData?.success){
          toast.success("Car details extracted successfully");
          setImagePreview(aiImageData.image);
          console.log("[AI Extraction] Extraction successful.");
        } else {
          console.log("[AI Extraction] Extraction failed or no data returned.");
        }

      }
      {/* AI Image Preview */}
      useEffect(()=>{
        if(aiImageError){
         toast.error(aiImageError.message || "Failed to extract car details");
         console.log("[AI Extraction] Error:", aiImageError);
        }
      },[aiImageError])

      useEffect(()=>{
        if(aiImageData?.success){
          const carDetails = aiImageData.data;

          setValue("brand",carDetails.brand);
          setValue("model",carDetails.model);
          setValue("year", carDetails.year ? carDetails.year.toString() : "");
          setValue("color",carDetails.color);
          setValue("bodyType",carDetails.bodyType);
          if (carDetails.description) setValue("description", carDetails.description);
          if (carDetails.transmission) setValue("transmission", carDetails.transmission);
          if (carDetails.fuelType) setValue("fuelType", carDetails.fuelType);
          if (carDetails.seats) setValue("seats", carDetails.seats);

          // Optionally, you could store confidence in state if you want to display it elsewhere

          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target.result);
            // Add the preview image to uploadedImages if not already present
            setUploadedImages(prev => {
              if (!prev.includes(e.target.result)) {
                return [...prev, e.target.result];
              }
              return prev;
            });
          }
          reader.readAsDataURL(uploadedAiImage);

          toast.success("Car details extracted successfully",{
            description:`Detected ${carDetails.brand} ${carDetails.model} ${carDetails.year} ${carDetails.color} ${carDetails.bodyType}${carDetails.transmission ? ", " + carDetails.transmission : ""}${carDetails.fuelType ? ", " + carDetails.fuelType : ""}${carDetails.seats ? ", " + carDetails.seats + " seats" : ""}${carDetails.description ? ": " + carDetails.description : ""}${typeof carDetails.confidence === "number" ? " (" + Math.round(carDetails.confidence * 100) + "% confidence)" : ""}`
          });
          setActiveTab("manual");
          console.log(carDetails);
          console.log("[AI Extraction] Extracted details:", carDetails);
        }
      },[aiImageData,uploadedAiImage])

      useEffect(() => {
        if (aiImageLoading) {
          console.log("[Client] AI extraction is loading...");
        }
        if (aiImageData) {
          console.log("[Client] AI extraction result:", aiImageData);
        }
        if (aiImageError) {
          console.log("[Client] AI extraction error:", aiImageError);
        }
      }, [aiImageLoading, aiImageData, aiImageError]);

  
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
                  <Select
                    value={watch('year')}
                    onValueChange={val => setValue('year', val, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      id="year"
                      className={cn(
                        "w-full border rounded-md p-2 focus:ring-2",
                        errors.year
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#171716] focus:border-[#171716] focus:ring-[#171716]"
                      )}
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <p className="text-red-500 text-sm">{errors.year.message}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    placeholder="Enter the price of the car per day"
                    type="number"
                    {...register("price", { valueAsNumber: true })}
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
                    type="number"
                    {...register("mileage", { valueAsNumber: true })}  
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
                    type="number"
                    {...register("seats", { valueAsNumber: true })}
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
                      Supported formats: PNG, JPG, JPEG, WEBP (max 10MB each)
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
                      <div key={index} className="relative group">
                        <img src={image} alt={`Uploaded Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                        <Button 
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity"
                          variant="destructive"
                          size="icon"
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
              )}

              <Button 
                type="submit"
                className="w-full md:w-auto"
                disabled={createCarLoading}
              >
                {createCarLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save"}
              </Button>


            </form>
          </CardContent>
         
        </Card>
      </TabsContent>
      <TabsContent value="ai" className="mt-6">
      <Card className="bg-[#E8E0CF]  text-[#171716] rounded-md border-[#171716] shadow-2xl">
          <CardHeader>
            <CardTitle>Extract Car Details with AI</CardTitle>
            <CardDescription>
              Upload a car image and let our AI automatically fill in the car's details for you. This saves time and reduces manual entry errors.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className='space-y-6'>
                <div className="border-2 border-gray-500 rounded-lg p-6 border-dashed">
                    {imagePreview?
                      <div className='flex flex-col items-center '>
                        <img src={imagePreview} alt="Uploaded Image" className='max-h-64 object-contain mb-4 max-w-full' 
                        />
                        <div className='flex gap-2 '>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-[#E8E0CF]"
                            onClick={() => {
                              setImagePreview(null);
                              setUploadedAiImage(null);
                            }}
                          >
                           Remove
                          </Button>


                          <Button
                           size="sm"
                           className="text-[#E8E0CF]"
                           onClick={processAiImage}
                           disabled={aiImageLoading}
                          >
                            {aiImageLoading?(
                             <> 
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Extracting...</span>
                            </>
                            ):(
                                <>
                                  <Camera className='mr-2 h-4 w-4' />
                                  <span>Extract Details</span>
                                </>
                              )}
                          </Button>


                        </div>
                      </div>
                    :(
                       <div {...getAiImageProps()} className="cursor-pointer hover:bg-gray-300/20 rounded-lg">
                       <input {...getAiImageInputProps()} />
                       <div className="flex flex-col items-center justify-center">
                         <Camera
                           className="text-gray-500 mb-2 h-12 w-12 text-gray-500 mb-2"
                         />
                         <p className="text-lg font-medium  text-gray-500">
                           {isUploadingAi ? "Uploading..." : "Drag and drop your image here or click to upload"}
                         </p>
                        
                         <p className="text-sm text-gray-500 mt-2">
                           Supported formats: PNG, JPG, JPEG, WEBP (max 10MB)
                         </p>
                       </div>
                     </div>
                    )}
                </div>
                {/* Guidelines Section */}
                <div className="mt-6 p-4  border border-gray-500 rounded-lg">
                  <h3 className="font-semibold mb-2 text-[#991B1B]">How to use the AI Car Details Extraction Tool:</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                    <li>Click the upload area or drag and drop a clear image of the car you want to extract details from.</li>
                    <li>Wait for the image to upload. You will see a preview once it's ready.</li>
                    <li>Click <span className="font-semibold">"Extract Details"</span> to let the AI analyze the image.</li>
                    <li>After extraction, review the suggested car details and make any necessary edits before saving.</li>
                    <li>Only use high-quality images for best results. Supported formats: PNG, JPG, JPEG, WEBP (max 10MB).</li>
                  </ol>
                </div>
              </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  )
}

export default CarForm  