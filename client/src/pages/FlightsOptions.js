import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';
import FlightTable from "../components/FlightTable";

export default function FlightOptions() {
  const location = useLocation();
  const { data } = location.state; // Retrieve data passed via navigate
  const [selectedFlights, setSelectedFlights] = useState(data.flights); // Store selected flights

  // Callback function to handle date selection in the carousel
  const handleDateSelection = (selectedDate) => {
    const filteredFlights = data.flights.filter(flight => {
      const flightDate = new Date(flight.departureDate).toDateString();
      console.log(`flightDate: ${flightDate}`);
      return flightDate === selectedDate.toDateString();
    });
    setSelectedFlights(filteredFlights);
    console.log(`selectedFlights: ${JSON.stringify(selectedFlights)}`);
  };

  return (
    <div>
      <div className="container">
        <h5 className="mt-5 ms-5 px-5">Select your flight</h5>
        <h2 className="ms-5 px-5">{data.departureCode} bound for {data.destinationCode}</h2>
        {/* Pass data and handleDateSelection callback to Carousel */}
        <Carousel flights={data.flights} departureDate={data.departureDate} onDateSelect={handleDateSelection} />
        <FlightTable flights={selectedFlights} /> {/* Pass selected flights to FlightTable */}
        <div className="button-container m-4">
          <BackButton link="/flights" /> 
          <ContinueButton link="/flights/guests" /> 
        </div>
      </div>
    </div>
  );
}
