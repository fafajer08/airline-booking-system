import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';
import FlightTable from '../components/FlightTable';
import UserContext from '../context/UserContext';

export default function FlightOptions() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get data from location.state or localStorage
  const [data, setData] = useState(() => {
    const stateData = location.state && location.state.data;
    if (stateData) {
      // Save to localStorage
      localStorage.setItem('flightOptionsData', JSON.stringify(stateData));
      return stateData;
    } else {
      // Try to retrieve from localStorage
      const localData = localStorage.getItem('flightOptionsData');
      return localData ? JSON.parse(localData) : null;
    }
  });

  // Initialize departureDate from localStorage or defaultDepartureDate
  const [departureDate, setDepartureDate] = useState(() => {
    const savedDate = localStorage.getItem('departureDate');
    return savedDate || (data ? data.defaultDepartureDate : null);
  });

  const [flightsByDate, setFilteredFlights] = useState([]);

  // Initialize selectedFlight from localStorage if available
  const [selectedFlight, setSelectedFlight] = useState(() => {
    const savedFlight = localStorage.getItem('selectedFlight');
    return savedFlight ? JSON.parse(savedFlight) : null;
  });


  // useEffect to automatically populate the table based on departureDate
  useEffect(() => {
    if (!data) return;

    // Save departureDate to localStorage whenever it changes
    if (departureDate) {
      localStorage.setItem('departureDate', departureDate);
    }

    const filteredFlights = data.flightsByLocation.filter(flight => flight.date === departureDate);
    setFilteredFlights(filteredFlights);
  }, [departureDate, data]);

  // Handler for date selection from the Carousel
  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setDepartureDate(formattedDate);
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    // Save selected flight to localStorage
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    console.log('Selected Flight:', flight);
  };

  const handleContinue = async () => {
    if (!selectedFlight) {
      alert('Please select a flight before continuing.');
      return;
    }

    if (!user) {
      console.warn("User not logged in, proceeding as guest");
    }

    const requestData = {
      user: user ? user : null,
      selectedFlight: selectedFlight,
      promo: data && data.promo ? data.promo : null,
    };

    // Clear cached data when navigating away
    localStorage.removeItem('flightOptionsData');
    localStorage.removeItem('departureDate');
    localStorage.removeItem('selectedFlight');

    navigate('/flights/guests', { state: { data: requestData } });
  };

  // If data is not yet available, render null or a loading indicator
  if (!data) {
    return null; // Or display a loading spinner or message
  }

  //console.log(data);

  const { departureCode, destinationCode } = data;

  return (
    <div className="flight-options">
      <div className="container mt-5">
        <h5 className="ms-5 px-5">Select your flight</h5>
        <h2 className="ms-5 px-5">
          {departureCode} bound for {destinationCode}
        </h2>

        {/* Use the Carousel component and pass necessary props */}
        <Carousel
          flights={data.flightsByLocation}
          departureDate={departureDate}
          onDateSelect={handleDateSelect}
        />

        {/* Pass selectedFlight and handleFlightSelect to FlightTable */}
        <FlightTable
          selectedFlights={flightsByDate}
          selectedFlight={selectedFlight}
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
