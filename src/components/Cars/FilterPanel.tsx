import React from "react";
import { FilterState } from "../../types";
import { X, AlignJustify } from "lucide-react";

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
      <div className="lg:hidden">
        <button
          onClick={onToggle}
          className="flex items-center justify-center space-x-2 w-full bg-blue-600 py-3 rounded-md text-white shadow-sm hover:bg-blue-700 transition-all font-medium"
        >
          <AlignJustify className="h-5 w-5" />
          <span>Filter Cars</span>
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
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        ></div>

        {/* Filter Content */}
        <div
          className={`
          fixed left-0 right-0 bottom-0 h-[90vh] bg-gray-950 shadow-xl transform transition-transform duration-300 ease-in-out rounded-t-3xl overflow-hidden
          lg:relative lg:w-full lg:shadow-none lg:transform-none lg:h-auto lg:bg-white/10 lg:backdrop-blur-sm lg:rounded-xl lg:border lg:border-white/20 lg:p-4
          ${isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
        `}
        >
          {/* Mobile Header with drag handle */}
          <div className="lg:hidden bg-gray-900">
            <div className="flex justify-center py-3">
              <div className="w-16 h-1.5 bg-gray-600 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">
                Filter Options
              </h3>
              <button
                onClick={onToggle}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6 overflow-y-auto h-[calc(90vh-130px)] lg:p-0 lg:space-y-4 lg:h-auto lg:pb-0">
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
            <div className="space-y-6 lg:space-y-3">
              {/* Brand Filter */}
              <div>
                <label className="block text-base font-medium lg:text-sm lg:text-gray-700 text-white mb-3 lg:mb-2">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="appearance-none w-full px-4 py-3.5 lg:py-2 lg:px-3 lg:border-gray-300 lg:bg-white bg-gray-800/70 border border-gray-700 text-white lg:text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
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
                <label className="block text-base font-medium lg:text-sm lg:text-gray-700 text-white mb-3 lg:mb-2">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) =>
                    handleFilterChange("fuelType", e.target.value)
                  }
                  className="appearance-none w-full px-4 py-3.5 lg:py-2 lg:px-3 lg:border-gray-300 lg:bg-white bg-gray-800/70 border border-gray-700 text-white lg:text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
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
                <label className="block text-base font-medium lg:text-sm lg:text-gray-700 text-white mb-3 lg:mb-2">
                  Transmission
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) =>
                    handleFilterChange("transmission", e.target.value)
                  }
                  className="appearance-none w-full px-4 py-3.5 lg:py-2 lg:px-3 lg:border-gray-300 lg:bg-white bg-gray-800/70 border border-gray-700 text-white lg:text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-base font-medium lg:text-sm lg:text-gray-700 text-white mb-3 lg:mb-2">
                  Price Range
                </label>
                <div className="space-y-5 lg:space-y-1">
                  <div>
                    <div className="flex justify-between mb-2 lg:mb-1 text-sm lg:text-xs lg:text-gray-700 text-gray-300">
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
                      className="w-full h-2 lg:h-1.5 accent-blue-500 rounded-lg appearance-none cursor-pointer bg-gray-800"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 lg:mb-1 text-sm lg:text-xs lg:text-gray-700 text-gray-300">
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
                      className="w-full h-2 lg:h-1.5 accent-blue-500 rounded-lg appearance-none cursor-pointer bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-base font-medium lg:text-sm lg:text-gray-700 text-white mb-3 lg:mb-2">
                  Year Range
                </label>
                <div className="space-y-5 lg:space-y-1">
                  <div>
                    <div className="flex justify-between mb-2 lg:mb-1 text-sm lg:text-xs lg:text-gray-700 text-gray-300">
                      <span>Min: {filters.minYear}</span>
                    </div>
                    <input
                      type="range"
                      min="2010"
                      max={new Date().getFullYear()}
                      value={filters.minYear}
                      onChange={(e) =>
                        handleFilterChange("minYear", parseInt(e.target.value))
                      }
                      className="w-full h-2 lg:h-1.5 accent-blue-500 rounded-lg appearance-none cursor-pointer bg-gray-800"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 lg:mb-1 text-sm lg:text-xs lg:text-gray-700 text-gray-300">
                      <span>Max: {filters.maxYear}</span>
                    </div>
                    <input
                      type="range"
                      min="2010"
                      max={new Date().getFullYear()}
                      value={filters.maxYear}
                      onChange={(e) =>
                        handleFilterChange("maxYear", parseInt(e.target.value))
                      }
                      className="w-full h-2 lg:h-1.5 accent-blue-500 rounded-lg appearance-none cursor-pointer bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Kilometers */}
              <div>
                <label className="block text-base font-medium lg:text-sm lg:text-gray-700 text-white mb-3 lg:mb-2">
                  Max Kilometers
                </label>
                <div>
                  <div className="flex justify-between text-sm lg:text-xs lg:text-gray-700 text-gray-300 mb-2 lg:mb-1">
                    <span>0 km</span>
                    <span>{filters.maxKilometers.toLocaleString()} km</span>
                  </div>
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
                    className="w-full h-2 lg:h-1.5 accent-blue-500 rounded-lg appearance-none cursor-pointer bg-gray-800"
                  />
                </div>
              </div>

              {/* Owners */}
              <div>
                <label className="block text-base font-medium lg:text-sm lg:text-gray-700 text-white mb-3 lg:mb-2">
                  Previous Owners
                </label>
                <select
                  value={filters.owners}
                  onChange={(e) => handleFilterChange("owners", e.target.value)}
                  className="appearance-none w-full px-4 py-3.5 lg:py-2 lg:px-3 lg:border-gray-300 lg:bg-white bg-gray-800/70 border border-gray-700 text-white lg:text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="">Any</option>
                  <option value="1">1st Owner</option>
                  <option value="2">2nd Owner</option>
                  <option value="3">3rd Owner</option>
                  <option value="4+">4+ Owners</option>
                </select>
              </div>
            </div>

            {/* Mobile Apply & Reset Buttons */}
            <div className="lg:hidden pt-5 mt-2 border-t border-gray-800 flex space-x-3">
              <button
                onClick={resetFilters}
                className="w-1/3 bg-gray-800 hover:bg-gray-700 text-white py-3.5 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onToggle}
                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-semibold transition-colors"
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
