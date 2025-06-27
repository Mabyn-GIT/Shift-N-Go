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
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Cars</h2>
          <p className="text-gray-600">Total: {cars.length} cars</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No cars found</div>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
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
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          car.images[0] ||
                          "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=150"
                        }
                        alt={`${car.brand} ${car.model}`}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-sm text-gray-500">{car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
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
                    <p className="font-semibold text-gray-900">
                      ₹{car.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="py-4 px-4">
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
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(car)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(car)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(car)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
