/*
  # Create cars table for ShiftNgo

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `brand` (text, car brand)
      - `model` (text, car model)
      - `year` (integer, manufacturing year)
      - `fuel_type` (text, fuel type)
      - `transmission` (text, transmission type)
      - `price` (integer, price in rupees)
      - `kilometers` (integer, kilometers driven)
      - `owners` (integer, number of previous owners)
      - `location` (text, optional location)
      - `featured` (boolean, featured car flag)
      - `description` (text, car description)
      - `images` (text array, image URLs)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cars` table
    - Add policy for public read access
    - Add policy for authenticated users to write
*/

CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  fuel_type text NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Electric')),
  transmission text NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
  price integer NOT NULL,
  kilometers integer NOT NULL,
  owners integer NOT NULL DEFAULT 1,
  location text,
  featured boolean DEFAULT false,
  description text,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can view cars)
CREATE POLICY "Cars are viewable by everyone"
  ON cars
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert cars
CREATE POLICY "Authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update cars
CREATE POLICY "Authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy for authenticated users to delete cars
CREATE POLICY "Authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS cars_brand_idx ON cars(brand);
CREATE INDEX IF NOT EXISTS cars_fuel_type_idx ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS cars_transmission_idx ON cars(transmission);
CREATE INDEX IF NOT EXISTS cars_price_idx ON cars(price);
CREATE INDEX IF NOT EXISTS cars_year_idx ON cars(year);
CREATE INDEX IF NOT EXISTS cars_featured_idx ON cars(featured);
CREATE INDEX IF NOT EXISTS cars_created_at_idx ON cars(created_at DESC);