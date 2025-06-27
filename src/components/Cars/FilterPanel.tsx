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
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
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
          fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform lg:relative lg:w-full lg:shadow-none lg:transform-none lg:h-auto lg:bg-white/80 lg:backdrop-blur-sm lg:rounded-2xl lg:border lg:border-gray-200/50 lg:p-4
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-3 lg:p-0 space-y-3 overflow-y-auto h-full lg:h-auto lg:pb-0">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) =>
                    handleFilterChange("fuelType", e.target.value)
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) =>
                    handleFilterChange("transmission", e.target.value)
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range: ₹{filters.minPrice.toLocaleString()} - ₹
                  {filters.maxPrice.toLocaleString()}
                </label>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", parseInt(e.target.value))
                    }
                    className="w-full"
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
