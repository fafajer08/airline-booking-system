
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

  // Initialize data from location.state or localStorage
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

  // State to manage selected class options for each flight
  const [selectedClasses, setSelectedClasses] = useState(() => {
    const savedClasses = localStorage.getItem('selectedClasses');
    return savedClasses ? JSON.parse(savedClasses) : {};
  });

  // useEffect to filter flights based on departureDate
  useEffect(() => {
    if (!data) return;

    // Save departureDate to localStorage whenever it changes
    if (departureDate) {
      localStorage.setItem('departureDate', departureDate);
    }

    const filteredFlights = data.flightsByLocation.filter(flight => flight.date === departureDate);
    setFilteredFlights(filteredFlights);
  }, [departureDate, data]);

  // useEffect to save selectedClasses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedClasses', JSON.stringify(selectedClasses));
  }, [selectedClasses]);

  // Handler for date selection from the Carousel
  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setDepartureDate(formattedDate);
  };

  // Handler for flight selection from FlightTable
  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    // Save selected flight to localStorage
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    console.log('Selected Flight:', flight);
  };

  /**
   * Handler for class selection from FlightTable.
   * Updates the selectedClasses state only for the selected flight.
   * @param {string} flightId - The ID of the selected flight.
   * @param {string} newClass - The newly selected class option.
   */
  const handleClassChange = (flightId, newClass) => {
    // Only update if the flight is selected
    if (selectedFlight && selectedFlight._id === flightId) {
      setSelectedClasses(prevClasses => ({
        ...prevClasses,
        [flightId]: newClass,
      }));
      console.log(`Flight ID: ${flightId}, Selected Class: ${newClass}`);
    }
  };

  /**
   * Function to compute the final price based on selected class and promo.
   * @param {object} flight - The selected flight object.
   * @returns {string} - The final price as a formatted string.
   */
  const computeFinalPrice = (flight) => {
    if (!flight) return '0.00';

    const pricing = flight.pricing || {};
    const distance = flight.flight.route.distanceKM || 0;
    const distanceFactor = pricing.distanceFactor || 0;

    // Retrieve selected class; default to 'economySeat' if not selected
    const selectedClass = selectedClasses[flight._id] || 'economySeat';

    // Define price multipliers for different classes
    const classMultipliers = {
      economySeat: pricing.economyFactor || 1,
      businessSeat: pricing.businessFactor || 1.5,
      premiumSeat: pricing.premiumFactor || 1.2,
      firstClass: pricing.firstClassFactor || 2,
    };

    const multiplier = classMultipliers[selectedClass] || 1;
    const basePrice = pricing.basePrice || 0;
    const price = multiplier * (basePrice + (distance * distanceFactor));

    // Apply promo discounts
    const discount = data?.promo?.discount || 0;
    const absolutePricing = data?.promo?.absolutePricing || 0;
    const discountedPrice = (price * (100 - discount)) / 100 + absolutePricing;

    return discountedPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  /**
   * useEffect to compute and save 'fare' whenever selectedFlight or its class changes.
   */
  useEffect(() => {
    if (!selectedFlight) {
      localStorage.removeItem('fare');
      return;
    }

    const finalPrice = computeFinalPrice(selectedFlight);
    localStorage.setItem('fare', finalPrice);
    console.log(`Final Price for Flight ID ${selectedFlight._id}: PHP ${finalPrice}`);
  }, [selectedFlight, selectedClasses]);

  /**
   * Handler for the Continue button.
   * Navigates to the next page with the selected flight, class, and final price.
   */
  const handleContinue = () => {
    if (!selectedFlight) {
      alert('Please select a flight before continuing.');
      return;
    }

    if (!user) {
      console.warn("User not logged in, proceeding as guest");
    }

    const finalPrice = computeFinalPrice(selectedFlight);

    const requestData = {
      user: user || null,
      selectedFlight: selectedFlight,
      selectedClass: selectedClasses[selectedFlight._id] || 'economySeat', // Default to 'economySeat' if not selected
      finalPrice: finalPrice, // Track final price
      promo: data?.promo || null,
    };

    // Save 'fare' to localStorage as 'fare' if not already saved
    localStorage.setItem('fare', finalPrice);

    // Clear cached data when navigating away
    localStorage.removeItem('flightOptionsData');
    localStorage.removeItem('departureDate');
    localStorage.removeItem('selectedFlight');
    localStorage.removeItem('selectedClasses');

    navigate('/flights/guests', { state: { data: requestData } });
  };

  // If data is not yet available, render a loading indicator or a message
  if (!data) {
    return (
      <div className="flight-options">
        <div className="container mt-5">
          <p>Loading flight options...</p>
        </div>
      </div>
    );
  }

  const { departureCode, destinationCode, promo } = data;

  return (
    <div className="flight-options">
      <div className="container mt-5">
        <h5 className="ms-5 px-5">Select your flight</h5>
        <h2 className="ms-5 px-5">
          {departureCode} bound for {destinationCode}
        </h2>

        {/* Carousel Component for Date Selection */}
        <Carousel
          flights={data.flightsByLocation}
          departureDate={departureDate}
          promo={promo || null}
          onDateSelect={handleDateSelect}
        />

        {/* FlightTable Component for Flight Selection and Class Options */}
        <FlightTable
          selectedFlights={flightsByDate}
          selectedFlight={selectedFlight}
          promo={promo || null}
          onSelectFlight={handleFlightSelect}
          onClassChange={handleClassChange} // Pass the handler
          selectedClasses={selectedClasses} // Pass selectedClasses for initial values
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
