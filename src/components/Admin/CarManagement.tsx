import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useCars } from "../../hooks/useCars";
import { Car } from "../../types";
import { Edit2, Trash2, Eye, Search, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import CarEditForm from "./CarEditForm";

const CarManagement: React.FC = () => {
  const { cars, loading, refetch } = useCars();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredCars = cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.fuel_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (car: Car) => {
    setSelectedCar(car);
    setShowViewDialog(true);
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setShowEditForm(true);
  };

  const handleDelete = async (car: Car) => {
    setSelectedCar(car);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCar) return;

    setDeleting(true);
    try {
      // Delete images from storage first
      if (selectedCar.images && selectedCar.images.length > 0) {
        const deletePromises = selectedCar.images.map(async (imageUrl) => {
          try {
            // Extract file path from URL
            const urlParts = imageUrl.split("/");
            const fileName = urlParts[urlParts.length - 1];
            const filePath = `cars/${fileName}`;

            await supabase.storage.from("car-images").remove([filePath]);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        });

        await Promise.all(deletePromises);
      }

      // Delete car record
      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", selectedCar.id);

      if (error) {
        throw error;
      }

      toast.success("Car deleted successfully");
      setShowDeleteDialog(false);
      setSelectedCar(null);
      refetch();
    } catch (error: any) {
      toast.error("Failed to delete car: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      {/* Responsive header with stacked layout on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Manage Cars
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Total: {cars.length} cars
          </p>
        </div>

        {/* Search - Full width on mobile */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="text-gray-400 mb-2 md:mb-4">No cars found</div>
          <p className="text-sm md:text-base text-gray-600">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-4 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  {/* Car Image */}
                  <div className="relative">
                    <img
                      src={
                        car.images[0] ||
                        "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=150"
                      }
                      alt={`${car.brand} ${car.model}`}
                      className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                      onClick={() => handleView(car)}
                    />
                    {car.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                        +{car.images.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-grow">
                    {/* Car Title & Status */}
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className="font-semibold text-sm"
                        onClick={() => handleView(car)}
                      >
                        {car.brand} {car.model}
                      </h4>
                      {car.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Basic Details */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600 mb-3">
                      <div>
                        Year:{" "}
                        <span className="font-medium text-gray-900">
                          {car.year}
                        </span>
                      </div>
                      <div>
                        Price:{" "}
                        <span className="font-medium text-gray-900">
                          ₹{car.price.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        Fuel:{" "}
                        <span className="font-medium text-gray-900">
                          {car.fuel_type}
                        </span>
                      </div>
                      <div>
                        KM:{" "}
                        <span className="font-medium text-gray-900">
                          {car.kilometers.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        Transmission:{" "}
                        <span className="font-medium text-gray-900">
                          {car.transmission}
                        </span>
                      </div>
                      <div>
                        Owners:{" "}
                        <span className="font-medium text-gray-900">
                          {car.owners}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end items-center mt-2 border-t pt-2">
                      <button
                        onClick={() => handleView(car)}
                        className="flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        aria-label="View car details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(car)}
                        className="flex items-center justify-center p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors ml-1"
                        aria-label="Edit car"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(car)}
                        className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1"
                        aria-label="Delete car"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Car
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Details
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
                  <tr
                    key={car.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                          src={
                            car.images[0] ||
                            "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=150"
                          }
                          alt={`${car.brand} ${car.model}`}
                          className="w-12 h-10 sm:w-16 sm:h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {car.year}
                          </p>
                          {/* Show details for mobile only */}
                          <p className="text-xs text-gray-500 sm:hidden mt-1">
                            {car.fuel_type} • {car.kilometers.toLocaleString()}{" "}
                            km
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <div className="text-xs md:text-sm">
                        <p className="text-gray-900">
                          {car.fuel_type} • {car.transmission}
                        </p>
                        <p className="text-gray-500">
                          {car.kilometers.toLocaleString()} km • {car.owners}{" "}
                          owner{car.owners > 1 ? "s" : ""}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        ₹{car.price.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      {car.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleView(car)}
                          className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View car"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(car)}
                          className="p-1 sm:p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit car"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car)}
                          className="p-1 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete car"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Car
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedCar?.brand}{" "}
              {selectedCar?.model}? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Car Dialog */}
      {showViewDialog && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
              </h3>
              <button
                onClick={() => setShowViewDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Car Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedCar.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${selectedCar.brand} ${selectedCar.model} - Image ${
                    index + 1
                  }`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Car Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Brand
                </h4>
                <p className="text-lg text-gray-900">{selectedCar.brand}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Model
                </h4>
                <p className="text-lg text-gray-900">{selectedCar.model}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Year</h4>
                <p className="text-lg text-gray-900">{selectedCar.year}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Price
                </h4>
                <p className="text-lg text-gray-900">
                  ₹{selectedCar.price.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Fuel Type
                </h4>
                <p className="text-lg text-gray-900">{selectedCar.fuel_type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Transmission
                </h4>
                <p className="text-lg text-gray-900">
                  {selectedCar.transmission}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Kilometers
                </h4>
                <p className="text-lg text-gray-900">
                  {selectedCar.kilometers.toLocaleString()} km
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Owners
                </h4>
                <p className="text-lg text-gray-900">
                  {selectedCar.owners} Owner{selectedCar.owners > 1 ? "s" : ""}
                </p>
              </div>
              {selectedCar.location && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Location
                  </h4>
                  <p className="text-lg text-gray-900">
                    {selectedCar.location}
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Featured
                </h4>
                <p className="text-lg text-gray-900">
                  {selectedCar.featured ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Description */}
            {selectedCar.description && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h4>
                <p className="text-gray-900 whitespace-pre-line">
                  {selectedCar.description}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowViewDialog(false);
                  handleEdit(selectedCar);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Car
              </button>
              <button
                onClick={() => setShowViewDialog(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Dialog */}
      {showEditForm && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Car: {selectedCar.brand} {selectedCar.model}
              </h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Pass the selected car data to the CarEditForm for editing */}
            <CarEditForm
              car={selectedCar}
              onClose={() => setShowEditForm(false)}
              onSuccess={() => {
                setShowEditForm(false);
                refetch();
                toast.success("Car details updated successfully");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManagement;
