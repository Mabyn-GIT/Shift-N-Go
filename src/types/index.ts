export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuel_type: "Petrol" | "Diesel" | "CNG" | "Electric";
  transmission: "Manual" | "Automatic";
  price: number;
  kilometers: number;
  owners: number;
  location?: string;
  featured: boolean;
  images: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  fuelType: string; // This should match the Car's fuel_type property
  transmission: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  maxKilometers: number;
  owners: string;
  brand: string;
}
