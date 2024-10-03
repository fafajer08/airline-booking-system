import React, { useState, useEffect, useRef } from 'react';
import '../styles/carousel.css';

const Cards = ({ date, flightDetails, isSelected, onClick, promo }) => {
    // Format the date for display in YYYY-MM-DD format
    
    const discount = promo?.discount || 0;
    const absolutePricing = promo?.absolutePricing || 0;

    const formattedDate = new Date(date).toISOString().split('T')[0];
  
    const cardClass = isSelected ? 'card selected' : 'card';
  
    const price = ((flightDetails.flight.route.distanceKM * flightDetails.pricing.distanceFactor) + flightDetails.pricing.basePrice)
    
    const finalPrice = (( price * (100 - discount) / 100 ) + absolutePricing).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }); 
    

    return (
      <div className={cardClass} onClick={onClick}>
        <p>{formattedDate}</p>
        {flightDetails ? (
          <>
            {/* Display the lowest price */}
            <p>
              PHP {finalPrice}
            </p>
          </>
        ) : (
          <p>No Available Flights</p>
        )}
      </div>
    );
  };


  const Carousel = ({ flights, departureDate, onDateSelect, promo }) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
  
    // Helper function to calculate flight price
    const getFlightPrice = (flight) => {
      return (flight.flight.route.distanceKM * flight.pricing.distanceFactor) + flight.pricing.basePrice;
    };
  
    // Generate a list of dates
    const generateDates = (centerDate) => {
      const dates = [];
      const today = new Date();
      const center = new Date(centerDate);
  
      for (let i = -30; i <= 30; i++) {
        const newDate = new Date(center);
        newDate.setDate(center.getDate() + i);
  
        if (newDate >= today) {
          dates.push(newDate);
        }
      }
  
      return dates;
    };
  
    // Create cardsData
    const cardsData = generateDates(departureDate).map(date => {
      const formattedDate = date.toISOString().split('T')[0];
  
      // Get all flights for this date
      const flightsForDate = flights.filter(flight => flight.date === formattedDate);
  
      if (flightsForDate.length > 0) {
        // Find the flight with the lowest price
        const flightWithLowestPrice = flightsForDate.reduce((prev, curr) => {
          return getFlightPrice(curr) < getFlightPrice(prev) ? curr : prev;
        });
  
        return {
          date,
          flightDetails: flightWithLowestPrice,
        };
      } else {
        return {
          date,
          flightDetails: null,
        };
      }
    });
  
    // Determine initial selected card
    const departureTimestamp = new Date(departureDate).getTime();
    const departureIndex = cardsData.findIndex(card => card.date.getTime() === departureTimestamp);
  
    const isFirstRender = useRef(true);
  
    useEffect(() => {
      if (isFirstRender.current) {
        setSelectedCard(departureTimestamp);
  
        let initialStartIndex = departureIndex - Math.floor(7 / 2);
        if (initialStartIndex < 0) {
          initialStartIndex = 0;
        }
        setStartIndex(initialStartIndex);
  
        isFirstRender.current = false;
      } else {
        setSelectedCard(departureTimestamp);
      }
    }, [departureTimestamp, departureIndex]);
  
    // Handle scrolling
    const handleLeftClick = () => {
      setStartIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };
  
    const handleRightClick = () => {
      setStartIndex(prevIndex => Math.min(prevIndex + 1, cardsData.length - 7));
    };
  
    // Get visible cards
    const visibleCards = cardsData.slice(startIndex, startIndex + 7);
  
    const handleCardClick = (date) => {
      const formattedDate = date.toISOString().split('T')[0];
      setSelectedCard(date.getTime());
      onDateSelect(date);
    };
  
    return (
      <div className="carousel-container">
        <button className="scroll-button left" onClick={handleLeftClick}>
          &#8249;
        </button>
        <div className="carousel">
          {visibleCards.map((card, index) => {
            const cardTimestamp = card.date.getTime();
            const isSelected = selectedCard === cardTimestamp;
  
            return (
              <Cards
                promo = {promo}
                key={index}
                date={card.date}
                flightDetails={card.flightDetails}
                isSelected={isSelected}
                onClick={() => handleCardClick(card.date)}
              />
            );
          })}
        </div>
        <button className="scroll-button right" onClick={handleRightClick}>
          &#8250;
        </button>
      </div>
    );
  };

export default Carousel;
