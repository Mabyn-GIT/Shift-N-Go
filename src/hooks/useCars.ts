import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCars(data || []);
    } catch (err: any) {
      setError('Failed to fetch cars: ' + err.message);
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return { cars, loading, error, refetch: fetchCars };
};