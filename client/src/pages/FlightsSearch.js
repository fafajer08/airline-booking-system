import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize useNavigate
  const [portOptions, setPortOptions] = useState([]);
  const [flightType, setFlightType] = useState('oneway'); // Default flight type
  const [departurePort, setDeparturePort] = useState({});
  const [destinationPort, setDestinationPort] = useState({});
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [adultsCount, setAdultsCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [input, setInput] = useState(null); // Promo code
  const [promoDetails, setPromoDetails] = useState(null); // State to store promo code details

  const handleFlightTypeChange = (selectedType) => {
    setFlightType(selectedType);
    console.log("Selected Flight Type:", selectedType);
  };

  // Fetch data from API and fall back to mock data if necessary
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/airports`); // Replace with actual API
      const data = await response.json();
      console.log("Fetched airports:", data); // Debugging fetched data
      setPortOptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data, using mock data:", error);
      const mockData = parseData(flightsData);
      console.log("Using mock data:", mockData); // Debugging mock data
      setPortOptions(mockData);
    }
  };

  useEffect(() => {
    fetchData(); // Call the fetch function to load data
  }, []); // Empty dependency array to call this effect once

  // Handle the search button click
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    let promoData = null; // Local variable to store promo details
  
    // Fetch promo code details if a promo code is provided
    if (input) {
      console.log("Attempting to fetch promo code details..."); // Debugging before API call
  
      try {
        const promoResponse = await fetch(`${process.env.REACT_APP_API_URL}/promos/searchpromocode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ promoCode: input }),
        });
  
        // Log the status of the response
        console.log("Promo Code API Response Status:", promoResponse.status);
  
        if (!promoResponse.ok) {
          throw new Error(`Promo code error: ${promoResponse.statusText}`);
        }
  
        promoData = await promoResponse.json();
        console.log("Promo Code Details (API Response):", promoData); // Debugging promo code data
        setPromoDetails(promoData);
      } catch (error) {
        console.error("Error fetching promo code:", error);
        setPromoDetails(null); // Reset promo details if there's an error
      }
    } else {
      console.log("No promo code provided."); // Log when input is empty
    }
  
    
    const formattedDepartureDate = departureDate ? new Date(departureDate).toISOString().split('T')[0] : null;

    // Gather data to send in the API request
    const data = {
      departureCode: departurePort.code,
      destinationCode: destinationPort.code,
      departureDate: formattedDepartureDate,
      adults: adultsCount,
      children: childCount,
      infants: infantsCount,
      promoCode: input,
      promo: promoData, // Use the local variable here
    };
  
    console.log("Data:", data); // Debugging data to be sent
    navigate('/flights/options', { state: { data: data } });
  };
  

  return (
    <div className='search-flight-container my-5'>
      <div className='search-flight-content container'>
        <h1 className="search-flight-heading my-5 mx-5">Where would you like to go?</h1>
        
        <div className="search-flight-type-selector d-flex align-items-center justify-content-center mb-2">  
          <FlightTypeSelector onFlightTypeChange={handleFlightTypeChange} />
        </div>
        
        <form onSubmit={handleSearch}>
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
                  <SearchFlightButton type="submit" />
                </div>
              </div>
            )}
            {flightType === 'roundtrip' && (
              <div className='search-flight-form-container'>
                {/* Round-trip form fields */}
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
