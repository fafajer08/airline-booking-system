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
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function SearchFlight() {
  const notyf = new Notyf({ duration: 3000});
  const navigate = useNavigate(); // Initialize useNavigate
  const [portOptions, setPortOptions] = useState([]);
  const [flightType, setFlightType] = useState('oneway'); // Default flight type
  const [departurePort, setDeparturePort] = useState({});
  const [destinationPort, setDestinationPort] = useState({});
  const [returnDate, setReturnDate] = useState(null);
  const [adultsCount, setAdultsCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [input, setInput] = useState(null); // Promo code
  const [promoDetails, setPromoDetails] = useState(null); // State to store promo code details
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
});
const [loading, setLoading] = useState(false); // Loading state

  const handleFlightTypeChange = (selectedType) => {
    setFlightType(selectedType);
    // console.log("Selected Flight Type:", selectedType);
  };


  console.log("departureDate: ", departureDate);
  // Fetch data from API and fall back to mock data if necessary
  const fetchData = async () => {
    setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData(); // Call the fetch function to load data
  }, []); // Empty dependency array to call this effect once

  // Handle the search button click
  const handleSearch = async (event) => {
    setLoading(true); // Start loading
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
        notyf.success('Promo code applied successfully!');
      } catch (error) {
        console.error("Error fetching promo code:", error);
        setPromoDetails(null); // Reset promo details if there's an error
        notyf.error('Failed to apply promo code.');
      }
    } else {
      console.log("No promo code provided."); // Log when input is empty
    }
  
    // const formattedDepartureDate = departureDate ? new Date(departureDate).toISOString().split('T')[0] : null;
  
    // Gather data to send in the API request
    const requestData = {
      departureCode: departurePort.code,
      destinationCode: destinationPort.code,
      defaultDepartureDate: departureDate,
      // departureDate: formattedDepartureDate,  //YYYY-MM-DD format
      adults: adultsCount,
      children: childCount,
      infants: infantsCount,
      promoCode: input,
      promo: promoData,
    };
  
    console.log("Request Data:", requestData); // Debugging data to be sent
  
    try {
      // Call the API to filter commercial flights
      const flightResponse = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/filterbylocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ departureCode: requestData.departureCode, destinationCode: requestData.destinationCode, departureDate: formattedDepartureDate}),
        body: JSON.stringify({ departureCode: requestData.departureCode, destinationCode: requestData.destinationCode, departureDate: departureDate}),
      });
  
      // Log the status of the response
      console.log("Flight Filter API Response Status:", flightResponse.status);
  
      if (!flightResponse.ok) {
        throw new Error(`Flight filter error: ${flightResponse.statusText}`);
      }
  
      const filteredFlights = await flightResponse.json();
      console.log("Filtered Flights (API Response):", filteredFlights); // Debugging filtered flight data
  
      // Navigate to the flights options page with the filtered flight data
      navigate('/flights/options', { state: { data: { ...requestData, flightsByLocation: filteredFlights } } });
      notyf.success('Flights found successfully!');
    } catch (error) {
      console.error("Error fetching filtered flights:", error);
      // notyf.error('Failed to search for flights.');
      notyf.error('No flights found for the selected route.');
      // Optionally, handle error cases like showing a message to the user
    }  finally {
      setLoading(false); // Stop loading
    }
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
                  {/* YYYY-MM-DD FORMAT*/}
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
