import React, { useState } from "react";
import "../styles/hero.css"; 
// import  'bootstrap-icons/font/bootstrap-icons.css';
import SearchFlightHero from '../components/SearchFlightHero'


const HeroSection = () => {

  const [departureAirport, setDepartureAirport] = useState({
    cityName: '',
    airportCode: '',
    airportName: ''
  });


  const [formType, setFormType] = useState('round-trip');

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Explore the World</h1>
        <p>Find the best deals on flights and destinations</p>
        <SearchFlightHero />

      </div>
    </section>

  );
};

export default HeroSection;
