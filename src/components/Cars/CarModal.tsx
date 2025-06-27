import React, { useState } from "react";
import { Car } from "../../types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Settings,
  Users,
  MapPin,
  Phone,
  MessageCircle,
  ZoomIn,
} from "lucide-react";

interface CarModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

const CarModal: React.FC<CarModalProps> = ({ car, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!car || !isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + car.images.length) % car.images.length
    );
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the ${car.brand} ${car.model} (${
      car.year
    }) priced at ₹${car.price.toLocaleString()}. Can you provide more details?`;
    window.open(
      `https://wa.me/919585889519?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleCall = () => {
    window.open("tel:+919585889519", "_self");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      {isFullScreen ? (
        /* Full Screen Image View */
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black"
          onClick={() => setIsFullScreen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(false); // Close full-screen only, not the entire modal
            }}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-70"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-70"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-70"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <img
            src={car.images[currentImageIndex]}
            alt={`${car.brand} ${car.model} - Full Size`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing fullscreen
          />

          {/* Image Indicators */}
          {car.images.length > 1 && (
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the indicators container
            >
              {car.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {car.brand} {car.model} ({car.year})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Image Slider */}
          <div className="relative">
            <img
              src={car.images[currentImageIndex]}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-64 md:h-96 object-cover cursor-pointer"
              onClick={toggleFullScreen}
            />

            {car.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold">
              ₹{car.price.toLocaleString()}
            </div>

            {/* Full Screen Button */}
            <button
              onClick={toggleFullScreen}
              className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              title="View full size"
            >
              <ZoomIn className="h-5 w-5" />
            </button>

            {/* Image Indicators */}
            {car.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {car.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Fuel className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Fuel Type</p>
                <p className="font-semibold">{car.fuel_type}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Settings className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Transmission</p>
                <p className="font-semibold">{car.transmission}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Kilometers</p>
                <p className="font-semibold">
                  {car.kilometers.toLocaleString()} km
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Owners</p>
                <p className="font-semibold">
                  {car.owners} Owner{car.owners > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Location */}
            {car.location && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">
                    Location: {car.location}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp Inquiry</span>
              </button>
              <button
                onClick={handleCall}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Call Now</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Car Description
              </h3>
              <div className="text-sm text-gray-600">
                {car.description ? (
                  <p className="whitespace-pre-line">{car.description}</p>
                ) : (
                  <p>No description available for this car.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarModal;
