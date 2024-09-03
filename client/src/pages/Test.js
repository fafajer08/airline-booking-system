import React, { useState } from 'react';
import Navbar from "../components/NavBar";
import SearchFlightButton from "../components/Buttons";
import { ContinueButton, BackButton, SelectButton, SubmitButton } from "../components/Buttons";
import DateSelector from "../components/DateSelector";
import PortSelector from "../components/PortSelector";
import flightsData from '../data/flightsData';
import parseData from '../components/FlightsDataParser';

export default function Test() {
  const [departurePort, setDeparturePort] = useState({});
  const [destinationPort, setDestinationPort] = useState({});
  const [departureDate, setDepartureDate] = useState(null);

  const portOptions = parseData(flightsData);

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center flex-column align-items-center">
        <h1>Test Page</h1>
        <SearchFlightButton />
        <ContinueButton />
        <BackButton />
        <SelectButton />
        <SubmitButton />
        
        <DateSelector label="DEPARTURE DATE" onDateChange={setDepartureDate} />
        <p>Departure Date: {departureDate ? departureDate.toDateString() : "Select a date"}</p>
        
        <PortSelector 
          portOptions={portOptions} 
          setDeparturePort={setDeparturePort} 
          setDestinationPort={setDestinationPort} 
        />
        <p>Departure: {departurePort.cityName} {departurePort.portCode} ({departurePort.airportName})</p>
        <p>Destination: {destinationPort.cityName} {destinationPort.portCode} ({destinationPort.airportName})</p>
      </div>
    </div>
  );
}
