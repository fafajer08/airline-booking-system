import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';
import FlightTable from '../components/FlightTable';
import UserContext from '../context/UserContext';

export default function FlightOptions() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state; 

  console.log(data);
  
  const { departureCode, destinationCode, defaultDepartureDate, flightsByLocation, promo = null } = data;


  const [departureDate, setDepartureDate] = useState(defaultDepartureDate);
  const [flightsByDate, setFilteredFlights] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState(null); // Moved state here

  // useEffect to automatically populate the table based on departureDate
  useEffect(() => {
    const filteredFlights = flightsByLocation.filter(flight => flight.date === departureDate);
    setFilteredFlights(filteredFlights);
  }, [departureDate, flightsByLocation]);

  // Handler for date selection from the Carousel
  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setDepartureDate(formattedDate);
  };

  // Handler for flight selection from FlightTable
  const handleFlightSelect = (flightId) => {
    setSelectedFlightId(flightId);
    console.log('Selected Flight Id:', flightId);
  };

  // Handler for Continue button click
  const handleContinue = async () => {
    if (!selectedFlightId) {
      alert('Please select a flight before continuing.');
      return;
    }
    
    if (!user) {
      console.warn("User not logged in, proceeding as guest");
    }

      // Prepare the data to send in the API request
      const requestData = {
        userId: user?.id || null,  // let  user proceed even when not logged in
        selectedFlightId: selectedFlightId,
        promoId: promo && promo.id ? promo.id : null,
      }
        // Include any other necessary data


      // Perform the API fetch
      // Navigate to the next page, passing any necessary state
      navigate('/flights/guests', { state: { data: requestData } });

  };

  return (
    <div className="flight-options">
      <div className="container mt-5">
        <h5 className="ms-5 px-5">Select your flight</h5>
        <h2 className="ms-5 px-5">
          {departureCode} bound for {destinationCode}
        </h2>

        {/* Use the Carousel component and pass necessary props */}
        <Carousel 
          flights={flightsByLocation} 
          departureDate={departureDate} 
          onDateSelect={handleDateSelect} 
        />

        {/* Pass selectedFlightId and handleFlightSelect to FlightTable */}
        <FlightTable 
          selectedFlights={flightsByDate} 
          selectedFlightId={selectedFlightId} 
          onSelectFlight={handleFlightSelect} 
        />

        {/* Navigation Buttons */}
        <div className="button-container m-4 d-flex justify-content-between">
          <BackButton link="/flights" />
          <ContinueButton onClick={handleContinue} />
        </div>
      </div>
    </div>
  );
}
