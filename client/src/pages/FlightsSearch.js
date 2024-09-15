import React, { useState, useEffect } from 'react';
import SearchFlightButton from "../components/Buttons.js";
import DateSelector from "../components/SelectorDate.js";
import PortSelector from "../components/SelectorPort.js";
import PaxSelector from '../components/SelectorPax.js';
import InputBox from '../components/InputBox.js';
import FlightTypeSelector from "../components/SelectorFlightType.js";
import '../styles/flightsearch.css';
import parseData from '../components/FlightsDataParser.js'; // Updated import
import flightsData from '../data/flightsData.js';

export default function SearchFlight() {
  const [portOptions, setPortOptions] = useState([]);
  const [flightType, setFlightType] = useState('oneway'); // Default flight type
  const [departurePort, setDeparturePort] = useState({});
  const [destinationPort, setDestinationPort] = useState({});
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [adultsCount, setAdultsCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [input, setInput] = useState(null);

  const handleFlightTypeChange = (selectedType) => {
    setFlightType(selectedType);
    console.log("Selected Flight Type:", selectedType);
  };

  // Fetch data from API and fall back to mock data if necessary
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/airports`);// Replace with actual API
      const data = await response.json();
      console.log("Fetched airports:", data);
      setPortOptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data, using mock data:", error);
      // Use parsed mock data in case of error
      setPortOptions(parseData(flightsData));
    }
  };

  useEffect(() => {
    fetchData(); // Call the fetch function to load data
  }, []); // Empty dependency array to call this effect once

  const portOptionsArray = [...portOptions]

console.log("Port Options Array:", portOptionsArray);

  return (
    <div className='search-flight-container my-5'>
      <div className='search-flight-content container'>
        <h1 className="search-flight-heading my-5 mx-5">Where would you like to go?</h1>
        
        <div className="search-flight-type-selector d-flex align-items-center justify-content-center mb-2">  
          <FlightTypeSelector onFlightTypeChange={handleFlightTypeChange} />
        </div>
        
        <form>
            {flightType === 'oneway' && (
              <div className='search-flight-form-container'>
                <div className='search-flight-row search-flight-row--oneway'>
                  <PortSelector 
                      portOptions={portOptions} 
                      setDeparturePort={setDeparturePort} 
                      setDestinationPort={setDestinationPort} 
                  />
                  <DateSelector label="DEPARTURE DATE" onDateChange={setDepartureDate} />
                </div>
                <div className='search-flight-row search-flight-row--oneway'>
                  <PaxSelector label={'ADULTS (12+ YEARS)'} setPaxCount={setAdultsCount} />
                  <PaxSelector label={'CHILDREN (2-11 YEARS)'} setPaxCount={setChildCount} />
                  <PaxSelector label={'INFANTS (UNDER 2 YEARS)'} setPaxCount={setInfantsCount} />
                  <InputBox label="ENTER PROMO CODES" placeholder="Enter Code" onChange={setInput}/>
                </div>
                <div className='search-flight-submit-btn'>
                  <SearchFlightButton link="/flights/options" />
                </div>
              </div>
            )}

            {flightType === 'roundtrip' && (
              <div className='search-flight-form-container'>
                <div className="search-flight-row search-flight-row--roundtrip">
                  <PortSelector 
                      portOptions={portOptions} 
                      setDeparturePort={setDeparturePort} 
                      setDestinationPort={setDestinationPort} 
                  />
                  <DateSelector label="DEPARTURE DATE" onDateChange={setDepartureDate} />
                  <DateSelector label="RETURN DATE" onDateChange={setReturnDate} />
                </div>
                <div className="search-flight-row search-flight-row--roundtrip">
                  <PaxSelector label={'ADULTS (12+ YEARS)'} setPaxCount={setAdultsCount} />
                  <PaxSelector label={'CHILDREN (2-11 YEARS)'} setPaxCount={setChildCount} />
                  <PaxSelector label={'INFANTS (UNDER 2 YEARS)'} setPaxCount={setInfantsCount} />
                  <InputBox label="ENTER PROMO CODES" placeholder="Enter Code" onChange={setInput}/>
                </div>
                <div className='search-flight-submit-btn'>
                  <SearchFlightButton link="/flights/options" />
                </div>
              </div>
            )}
          </form>
      </div>
    </div>
  );
}
