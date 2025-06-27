import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
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
