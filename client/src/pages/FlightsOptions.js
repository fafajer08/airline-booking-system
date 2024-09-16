import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';
import FlightTable from "../components/FlightTable";

export default function FlightOptions() {
  const location = useLocation();
  const data = location.state?.data; // Access the passed data
  const [flights, setFlights] = useState([]); // State to store the fetched flights
  const [error, setError] = useState(null); // State to store any errors

  useEffect(() => {
    // Check if the required data is available
    if (data?.departureCode && data?.destinationCode) {
      console.log("Attempting to fetch flights with filter criteria..."); // Debugging
      fetch(`${process.env.REACT_APP_API_URL}/commercialflights/filterbylocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if needed
        },
        body: JSON.stringify({
          departureCode: data.departureCode,
          destinationCode: data.destinationCode,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching flights: ${response.statusText}`);
          }
          return response.json();
        })
        .then(fetchedFlights => {
          console.log("Fetched Flights:", fetchedFlights); // Debugging the response
          setFlights(fetchedFlights); // Store the fetched flights in state
        })
        .catch(error => {
          console.error("Error fetching flights:", error);
          setError(error.message); // Set error state
        });
    } else {
      console.error("Missing required data for flight search."); // Log if data is missing
    }
  }, [data]);

  return (
    <div>
      <div className="container">
        <h5 className="mt-5 ms-5 px-5">Select your flight</h5>
        <h2 className="ms-5 px-5">
          {data?.departureCode} bound for {data?.destinationCode}
        </h2>
        <Carousel />
        
        {error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <FlightTable flights={flights} />
        )}

        <div className="button-container m-4">
          <BackButton link="/flights" /> 
          <ContinueButton link="/flights/guests" /> 
        </div>
      </div>
    </div>
  );
}
