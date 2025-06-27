import React, { useState, useMemo } from "react";
import { Car, FilterState } from "../../types";
import CarCard from "./CarCard";
import CarModal from "./CarModal";
import FilterPanel from "./FilterPanel";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface CarGridProps {
  cars: Car[];
  loading: boolean;
}

const CarGrid: React.FC<CarGridProps> = ({ cars, loading }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 4; // Show only 4 cars per page

  const [filters, setFilters] = useState<FilterState>({
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

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      if (
        searchTerm &&
        !`${car.brand} ${car.model} ${car.year}`
          .toLowerCase()
          .includes(searchLower)
      ) {
        return false;
      }

      // Brand filter
      if (filters.brand && car.brand !== filters.brand) return false;

      // Fuel type filter
      if (filters.fuelType && car.fuel_type !== filters.fuelType) return false;

      // Transmission filter
      if (filters.transmission && car.transmission !== filters.transmission)
        return false;

      // Price range filter
      if (car.price < filters.minPrice || car.price > filters.maxPrice)
        return false;

      // Year range filter
      if (car.year < filters.minYear || car.year > filters.maxYear)
        return false;

      // Kilometers filter
      if (car.kilometers > filters.maxKilometers) return false;

      // Owners filter
      if (filters.owners && filters.owners !== "Any") {
        if (filters.owners === "4+" && car.owners < 4) return false;
        if (filters.owners !== "4+" && car.owners !== parseInt(filters.owners))
          return false;
      }

      return true;
    });
  }, [cars, filters, searchTerm]);

  // Calculate pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <section
        id="inventory"
        className="py-20 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 relative overflow-hidden"
      >
        {/* Background decoration with red touch */}
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-red-500 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-red-600 to-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Premium Collection
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              <span className="ml-2 text-gray-300">
                Loading our finest cars...
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="inventory"
      className="py-20 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 relative overflow-hidden"
    >
      {/* Background decoration with red touch */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-red-500 to-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-red-600 to-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Premium Collection
          </h2>
          <div className="h-1 w-24 bg-red-600 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Discover your perfect ride from our curated selection of certified
            pre-owned vehicles
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Search cars by make, model, or year..."
            />
          </div>
        </div>

        {/* Filter and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Filter Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
              <FilterPanel
                isOpen={isFilterOpen}
                onToggle={() => setIsFilterOpen(!isFilterOpen)}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </div>

          {/* Car Cards - Takes 3 columns */}
          <div className="lg:col-span-3">
            {filteredCars.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
                <p className="text-white text-lg">
                  No cars match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onClick={() => handleCarClick(car)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full ${
                        currentPage === 1
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="text-white">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-full ${
                        currentPage === totalPages
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Car Modal */}
      {selectedCar && (
        <CarModal
          car={selectedCar}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default CarGrid;
