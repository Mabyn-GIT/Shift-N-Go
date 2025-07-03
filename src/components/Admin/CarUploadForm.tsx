import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Upload, X, Car, Check, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const CarUploadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: String(new Date().getFullYear()),
    fuel_type: "Petrol" as "Petrol" | "Diesel" | "CNG" | "Electric",
    transmission: "Manual" as "Manual" | "Automatic",
    price: "",
    kilometers: "",
    owners: 1,
    location: "",
    featured: false,
    description: "",
  });

  const [customBrand, setCustomBrand] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // If changing brand to something other than "Other", reset customBrand
    if (name === "brand" && value !== "Other") {
      setCustomBrand("");
    }

    setFormData((prev) => {
      if (type === "checkbox") {
        return {
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        };
      }

      // For number fields stored as text inputs (year, price, kilometers)
      if (name === "year" || name === "price" || name === "kilometers") {
        // Only allow digits and ensure we're working with numbers for these fields
        const numericValue = value.replace(/\D/g, "");
        return {
          ...prev,
          [name]:
            name === "year" && !numericValue
              ? new Date().getFullYear()
              : numericValue,
        };
      }

      // Default case for other fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBrand(e.target.value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    try {
      // Show compression notification
      toast.loading("Compressing images...", { id: "compressing" });

      // Compression options
      const options = {
        maxSizeMB: 1, // Maximum size in MB (compress to under 1MB)
        maxWidthOrHeight: 1920, // Resize to max width/height of 1920px
        useWebWorker: true, // Use web worker for better performance
        fileType: "image/jpeg", // Convert all images to JPEG for better compression
        quality: 0.8, // 80% quality - good balance between size and quality
      };

      // Process each image with compression
      const compressedFiles = await Promise.all(
        validFiles.map(async (file) => {
          try {
            // Check if file is already small enough
            if (file.size <= 1 * 1024 * 1024) {
              // If already under 1MB
              console.log(
                `Image ${file.name} already under 1MB, skipping compression`
              );
              return file;
            }

            console.log(
              `Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(
                2
              )}MB)...`
            );
            const compressedFile = await imageCompression(file, options);

            // Log compression results
            console.log(
              `Compressed ${file.name} from ${(file.size / 1024 / 1024).toFixed(
                2
              )}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
            );

            // Create a new file with the original filename but compressed data
            const compressedBlob = compressedFile;
            const newFile = new File([compressedBlob], file.name, {
              type: "image/jpeg",
              lastModified: new Date().getTime(),
            });

            return newFile;
          } catch (error) {
            console.error(`Error compressing image ${file.name}:`, error);
            return file; // Fall back to original if compression fails
          }
        })
      );

      toast.dismiss("compressing");
      toast.success(`${compressedFiles.length} images processed successfully`);

      setImages((prev) => [...prev, ...compressedFiles]);
    } catch (error) {
      toast.dismiss("compressing");
      toast.error("Error processing images");
      console.error("Image compression error:", error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  // Drag and drop functions for reordering images
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove("dragging");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
    
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;

    setImages((prev) => {
      const newImages = [...prev];
      const draggedImage = newImages[dragIndex];
      
      // Remove the dragged image
      newImages.splice(dragIndex, 1);
      
      // Insert it at the drop position
      newImages.splice(dropIndex, 0, draggedImage);
      
      return newImages;
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${index}-${image.name.replace(
          /[^a-zA-Z0-9.-]/g,
          "_"
        )}`;
        const filePath = `cars/${fileName}`;

        console.log(
          `Uploading image ${index + 1}/${images.length}: ${fileName} (${(
            image.size /
            1024 /
            1024
          ).toFixed(2)}MB)`
        );

        const { error } = await supabase.storage
          .from("car-images")
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error(`Storage upload error:`, error);
          throw error;
        }

        // Get public URL
        const { data } = supabase.storage
          .from("car-images")
          .getPublicUrl(filePath);

        if (!data || !data.publicUrl) {
          throw new Error("Failed to get public URL for uploaded image");
        }

        console.log(
          `Image ${index + 1} uploaded successfully:`,
          data.publicUrl
        );
        return data.publicUrl;
      } catch (error) {
        console.error(`Error uploading image ${index + 1}:`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.brand ||
      !formData.model ||
      !formData.price ||
      !formData.kilometers ||
      (formData.brand === "Other" && !customBrand) ||
      !formData.year
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setUploading(true);

    try {
      console.log("Starting car upload process...");

      // Upload images first
      console.log("Starting image upload...");
      const imageUrls = await uploadImages();
      console.log("All images uploaded successfully:", imageUrls);

      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("No image URLs were returned after upload");
      }

      // Create car record
      const carData = {
        brand: formData.brand === "Other" ? customBrand : formData.brand,
        model: formData.model,
        year: parseInt(formData.year as string) || new Date().getFullYear(),
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        price: parseInt(formData.price as string) || 0,
        kilometers: parseInt(formData.kilometers as string) || 0,
        owners: formData.owners,
        location: formData.location,
        featured: formData.featured,
        description: formData.description,
        images: imageUrls,
      };

      console.log("Creating car record with data:", carData);

      const { data, error } = await supabase
        .from("cars")
        .insert([carData])
        .select();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Car upload completed successfully!", data);
      toast.success("Car uploaded successfully!");
      setSuccess(true);

      // Reset form
      setFormData({
        brand: "",
        model: "",
        year: String(new Date().getFullYear()),
        fuel_type: "Petrol",
        transmission: "Manual",
        price: "",
        kilometers: "",
        owners: 1,
        location: "",
        featured: false,
        description: "",
      });
      setCustomBrand("");
      setImages([]);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error("Upload failed: " + (error.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const brands = [
    "Maruti Suzuki",
    "Hyundai",
    "Honda",
    "Toyota",
    "Tata",
    "Mahindra",
    "Ford",
    "Volkswagen",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Other",
  ];

  if (success) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Car Uploaded Successfully!
        </h3>
        <p className="text-gray-600 mb-6">
          Your car has been added to the inventory and is now live on the
          website.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upload Another Car
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Car className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload New Car</h2>
          <p className="text-gray-600">Add a new car to your inventory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <div>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              {/* Custom brand input */}
              {formData.brand === "Other" && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customBrand}
                    onChange={handleCustomBrandChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter brand name"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Swift, City, Creta"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              inputMode="numeric"
              pattern="\d*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              inputMode="numeric"
              pattern="\d*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 500000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type *
            </label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission *
            </label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kilometers Driven *
            </label>
            <input
              type="text"
              name="kilometers"
              value={formData.kilometers}
              onChange={handleInputChange}
              inputMode="numeric"
              pattern="\d*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 50000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Previous Owners *
            </label>
            <select
              name="owners"
              value={formData.owners}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={1}>1st Owner</option>
              <option value={2}>2nd Owner</option>
              <option value={3}>3rd Owner</option>
              <option value={4}>4+ Owners</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Mumbai, Delhi"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter detailed description of the car including its condition, features, etc."
          />
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Mark as Featured Car
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Images * (Maximum 10 images)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Click to upload images
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 10MB each
              </p>
            </label>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Drag images to reorder them. First image will be the main image.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group cursor-move image-grid-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-transparent group-hover:border-blue-300 transition-colors"
                    />
                    
                    {/* Drag handle */}
                    <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-3 w-3" />
                    </div>
                    
                    {/* Index indicator */}
                    <div className="absolute top-1 right-8 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    {/* Main image indicator */}
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              "Upload Car"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarUploadForm;
