import React, { useState, useEffect } from "react";
import "../styles/hero.css";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import SearchFlightHero from '../components/SearchFlightHero';

const HeroSection = () => {
  const [departureAirport, setDepartureAirport] = useState({
    cityName: '',
    airportCode: '',
    airportName: ''
  });

  const [formType, setFormType] = useState('round-trip');

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS
  }, []);

  return (
    <section className="hero" data-aos="fade-in">
    <div className="hero-content" data-aos="fade-up">
      <h1 data-aos="fade-up" data-aos-delay="200">Explore the World</h1>
      <p data-aos="fade-up" data-aos-delay="400">Find the best deals on flights and destinations</p>
      <SearchFlightHero />
    </div>
  </section>
  );
};

export default HeroSection;
