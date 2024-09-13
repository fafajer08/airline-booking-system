import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import Hero from '../components/Hero';
import WindowDestination from '../components/WindowDestination';
import WindowDealsCards from '../components/WindowDealsCards';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS
  }, []);

  return (
    <>
      <Hero />
      <WindowDestination />
      <WindowDealsCards />
    </>
  );
}
