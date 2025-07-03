import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Upload, X, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { Car as CarType } from "../../types";
import imageCompression from "browser-image-compression";

interface CarEditFormProps {
  car: CarType;
  onClose: () => void;
  onSuccess: () => void;
  onError?: (error: any) => void;
}

const CarEditForm: React.FC<CarEditFormProps> = ({
  car,
  onClose,
  onSuccess,
  onError,
}) => {
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

  // Check if the car's brand is a custom brand (not in predefined list)
  const isCustomBrand = car.brand && !brands.slice(0, -1).includes(car.brand);
  
  const [formData, setFormData] = useState({
    brand: isCustomBrand ? "Other" : car.brand || "",
    model: car.model || "",
    year: car.year || new Date().getFullYear(),
    fuel_type:
      car.fuel_type || ("Petrol" as "Petrol" | "Diesel" | "CNG" | "Electric"),
    transmission: car.transmission || ("Manual" as "Manual" | "Automatic"),
    price: car.price?.toString() || "",
    kilometers: car.kilometers?.toString() || "",
    owners: car.owners || 1,
    location: car.location || "",
    featured: car.featured || false,
    description: car.description || "",
  });

  const [customBrand, setCustomBrand] = useState(isCustomBrand ? car.brand || "" : "");
  const [existingImages, setExistingImages] = useState<string[]>(
    car.images || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

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

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBrand(e.target.value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + existingImages.length + newImages.length > 10) {
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

      setNewImages((prev) => [...prev, ...compressedFiles]);
    } catch (error) {
      toast.dismiss("compressing");
      toast.error("Error processing images");
      console.error("Image compression error:", error);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop functions for reordering existing images
  const handleExistingImageDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", `existing-${index}`);
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).classList.add("dragging");
  };

  const handleExistingImageDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove("dragging");
  };

  const handleExistingImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleExistingImageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add("drag-over");
  };

  const handleExistingImageDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
  };

  const handleExistingImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
    
    const dragData = e.dataTransfer.getData("text/plain");
    
    if (!dragData.startsWith("existing-")) return;
    
    const dragIndex = parseInt(dragData.replace("existing-", ""));
    
    if (dragIndex === dropIndex) return;

    setExistingImages((prev) => {
      const newImages = [...prev];
      const draggedImage = newImages[dragIndex];
      
      // Remove the dragged image
      newImages.splice(dragIndex, 1);
      
      // Insert it at the drop position
      newImages.splice(dropIndex, 0, draggedImage);
      
      return newImages;
    });
  };

  // Drag and drop functions for reordering new images
  const handleNewImageDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", `new-${index}`);
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).classList.add("dragging");
  };

  const handleNewImageDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove("dragging");
  };

  const handleNewImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleNewImageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add("drag-over");
  };

  const handleNewImageDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
  };

  const handleNewImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
    
    const dragData = e.dataTransfer.getData("text/plain");
    
    if (!dragData.startsWith("new-")) return;
    
    const dragIndex = parseInt(dragData.replace("new-", ""));
    
    if (dragIndex === dropIndex) return;

    setNewImages((prev) => {
      const newImages = [...prev];
      const draggedImage = newImages[dragIndex];
      
      // Remove the dragged image
      newImages.splice(dragIndex, 1);
      
      // Insert it at the drop position
      newImages.splice(dropIndex, 0, draggedImage);
      
      return newImages;
    });
  };

  const uploadNewImages = async (): Promise<string[]> => {
    if (newImages.length === 0) {
      return [];
    }

    const uploadPromises = newImages.map(async (image, index) => {
      try {
        // Create a unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${index}-${image.name.replace(
          /[^a-zA-Z0-9.-]/g,
          "_"
        )}`;
        const filePath = `cars/${fileName}`;

        console.log(
          `Uploading image ${index + 1}/${newImages.length}: ${fileName} (${(
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
      (formData.brand === "Other" && !customBrand)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setUploading(true);

    try {
      console.log("Starting car update process...");

      // Upload new images if any
      let allImageUrls = [...existingImages];
      if (newImages.length > 0) {
        console.log("Uploading new images...");
        const newImageUrls = await uploadNewImages();
        allImageUrls = [...allImageUrls, ...newImageUrls];
      }

      console.log("All images processed:", allImageUrls);

      // Update car record
      const carData = {
        brand: formData.brand === "Other" ? customBrand : formData.brand,
        model: formData.model,
        year: formData.year,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        price: parseInt(formData.price),
        kilometers: parseInt(formData.kilometers),
        owners: formData.owners,
        location: formData.location,
        featured: formData.featured,
        description: formData.description,
        images: allImageUrls,
      };

      console.log("Updating car record with data:", carData);

      const { error } = await supabase
        .from("cars")
        .update(carData)
        .eq("id", car.id);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Car updated successfully!");
      toast.success("Car updated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error("Update failed: " + (error.message || "Unknown error"));
      if (onError) {
        onError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg">
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
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              min="2000"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
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
              type="number"
              name="kilometers"
              value={formData.kilometers}
              onChange={handleInputChange}
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

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Images
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Drag images to reorder them. First image will be the main image.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div 
                  key={index} 
                  className="relative group cursor-move image-grid-item"
                  draggable
                  onDragStart={(e) => handleExistingImageDragStart(e, index)}
                  onDragEnd={handleExistingImageDragEnd}
                  onDragOver={handleExistingImageDragOver}
                  onDragEnter={handleExistingImageDragEnter}
                  onDragLeave={handleExistingImageDragLeave}
                  onDrop={(e) => handleExistingImageDrop(e, index)}
                >
                  <img
                    src={image}
                    alt={`Current Image ${index + 1}`}
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
                    onClick={() => removeExistingImage(index)}
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

        {/* New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add More Images (Maximum 10 images total)
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

          {/* New Image Preview */}
          {newImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                New images to be added. Drag to reorder them.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-move image-grid-item"
                    draggable
                    onDragStart={(e) => handleNewImageDragStart(e, index)}
                    onDragEnd={handleNewImageDragEnd}
                    onDragOver={handleNewImageDragOver}
                    onDragEnter={handleNewImageDragEnter}
                    onDragLeave={handleNewImageDragLeave}
                    onDrop={(e) => handleNewImageDrop(e, index)}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-transparent group-hover:border-blue-300 transition-colors"
                    />
                    
                    {/* Drag handle */}
                    <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-3 w-3" />
                    </div>
                    
                    {/* Index indicator */}
                    <div className="absolute top-1 right-8 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      +{index + 1}
                    </div>
                    
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    {/* New image indicator */}
                    <div className="absolute bottom-1 left-1 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarEditForm;
