import React from "react";
import { FilterState } from "../../types";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  isOpen,
  onToggle,
}) => {
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      fuelType: "",
      transmission: "",
      minPrice: 0,
      maxPrice: 5000000,
      minYear: 2010,
      maxYear: new Date().getFullYear(),
      maxKilometers: 200000,
      owners: "",
      brand: "",
    });
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
  ];

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-center space-x-2 w-full bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 text-white shadow-sm hover:shadow-md transition-shadow"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div
        className={`
        fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto
        ${isOpen ? "block" : "hidden lg:block"}
      `}
      >
        {/* Mobile Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        ></div>

        {/* Filter Content */}
        <div
          className={`
          fixed left-0 right-0 bottom-0 h-[85vh] bg-gray-800 shadow-xl transform transition-transform rounded-t-3xl 
          lg:relative lg:w-full lg:shadow-none lg:transform-none lg:h-auto lg:bg-white/10 lg:backdrop-blur-sm lg:rounded-xl lg:border lg:border-white/20 lg:p-4
          ${isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
        `}
        >
          {/* Mobile Header with handle */}
          <div className="lg:hidden">
            <div className="mx-auto w-12 h-1.5 bg-gray-400 rounded-full my-3"></div>
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-700 rounded-lg text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-0 space-y-3 overflow-y-auto h-[calc(85vh-80px)] lg:h-auto lg:pb-0">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Cars
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Reset All
              </button>
            </div>

            {/* Filter sections */}
            <div className="space-y-3">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium lg:text-gray-700 text-white mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full px-3 py-2 lg:border-gray-300 lg:bg-white bg-gray-700 border-gray-600 text-white lg:text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div>
                <label className="block text-sm font-medium lg:text-gray-700 text-white mb-1">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) =>
                    handleFilterChange("fuelType", e.target.value)
                  }
                  className="w-full px-3 py-2 lg:border-gray-300 lg:bg-white bg-gray-700 border-gray-600 text-white lg:text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Transmission Filter */}
              <div>
                <label className="block text-sm font-medium lg:text-gray-700 text-white mb-1">
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) =>
                    handleFilterChange("transmission", e.target.value)
                  }
                  className="w-full px-3 py-2 lg:border-gray-300 lg:bg-white bg-gray-700 border-gray-600 text-white lg:text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium lg:text-gray-700 text-white mb-1">
                  Price Range: ₹{filters.minPrice.toLocaleString()} - ₹
                  {filters.maxPrice.toLocaleString()}
                </label>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs lg:text-gray-700 text-gray-300 mb-1">
                      <span>Min: ₹{filters.minPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="50000"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", parseInt(e.target.value))
                      }
                      className="w-full accent-red-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs lg:text-gray-700 text-gray-300 mb-1">
                      <span>Max: ₹{filters.maxPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="50000"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", parseInt(e.target.value))
                      }
                      className="w-full accent-red-600"
                    />
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year: {filters.minYear} - {filters.maxYear}
                </label>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="2010"
                    max={new Date().getFullYear()}
                    value={filters.minYear}
                    onChange={(e) =>
                      handleFilterChange("minYear", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="2010"
                    max={new Date().getFullYear()}
                    value={filters.maxYear}
                    onChange={(e) =>
                      handleFilterChange("maxYear", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Kilometers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Kilometers: {filters.maxKilometers.toLocaleString()} km
                </label>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={filters.maxKilometers}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxKilometers",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>

              {/* Owners */}
              <div className="mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Owners
                </label>
                <select
                  value={filters.owners}
                  onChange={(e) => handleFilterChange("owners", e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1st Owner</option>
                  <option value="2">2nd Owner</option>
                  <option value="3">3rd Owner</option>
                  <option value="4+">4+ Owners</option>
                </select>
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="lg:hidden pt-3 border-t border-gray-200">
              <button
                onClick={onToggle}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
