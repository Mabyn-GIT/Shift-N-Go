import React from "react";
import { Car } from "../../types";
import { Fuel, Settings, Users, MapPin, Star } from "lucide-react";

interface CarCardProps {
  car: Car;
  onClick: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={
            car.images[0] ||
            "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800"
          }
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {car.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current" />
            <span>Featured</span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-bold">
          ₹{car.price.toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {car.brand} {car.model}
        </h3>

        {/* Year */}
        <p className="text-sm text-gray-500 mb-3">{car.year}</p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Fuel className="h-4 w-4" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Settings className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{car.kilometers.toLocaleString()} km</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {car.owners} Owner{car.owners > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Location */}
        {car.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{car.location}</span>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all group-hover:shadow-lg">
          View Details
        </button>
      </div>
    </div>
  );
};

export default CarCard;
