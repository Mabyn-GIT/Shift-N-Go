import React from 'react';
import Hero from '../components/Home/Hero';
import CarGrid from '../components/Cars/CarGrid';
import WhyShiftNgo from '../components/Home/WhyShiftNgo';
import Contact from '../components/Home/Contact';
import { useCars } from '../hooks/useCars';

const Home: React.FC = () => {
  const { cars, loading } = useCars();

  return (
    <>
      <Hero />
      <CarGrid cars={cars} loading={loading} />
      <WhyShiftNgo />
      <Contact />
    </>
  );
};

export default Home;