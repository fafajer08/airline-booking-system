import React, { useState } from 'react';
import Navbar from "../components/NavBar";
import SearchFlightButton,{ ContinueButton, BackButton, SelectButton, SubmitButton } from "../components/Buttons";
import DateSelector from "../components/SelectorDate.js";
import PortSelector from "../components/SelectorPort.js";
import flightsData from '../data/flightsData';
import parseData from '../components/FlightsDataParser';
import PaxSelector from '../components/SelectorPax.js';
import InputBox from '../components/InputBox';
import FlightTypeSelector from "../components/SelectorFlightType.js";

export default function Test() {
  const portOptions = parseData(flightsData);

  const [flightType, setFlightType] = useState('oneWay'); // Default flight type

  const [departurePort, setDeparturePort] = useState({});
  const [destinationPort, setDestinationPort] = useState({});
  const [departureDate, setDepartureDate] = useState(null);

  const [adultsCount, setAdultsCount] = useState(0);
  const [chilrentCount, setChildrentCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);

  const [input, setInput] = useState(null);


  return (
    <div>
      <div className="d-flex justify-content-center flex-column align-items-center">
        <h1>Test Page</h1>
        <FlightTypeSelector onFlightTypeChange={setFlightType} />
        <p>Flight type: {flightType}</p>
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
        <PaxSelector label={'ADULTS (12+ YEARS)'} setPaxCount={setAdultsCount} />
        <p>Adults: {adultsCount}</p>
        <PaxSelector label={'CHILDREN (2-11 YEARS)'} setPaxCount={setChildrentCount} />
        <p>Children: {chilrentCount}</p>
        <PaxSelector label={'INFANTS (UNDER 2 YEARS)'} setPaxCount={setInfantsCount} />
        <p>Infants: {infantsCount}</p>

        <InputBox label="ENTER PROMO CODES" placeholder="Enter Code" onChange={setInput}/>
        <p>Input: {input}</p>
      </div>
    </div>
  );
}
