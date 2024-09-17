import React, { useState, useEffect } from 'react';
import '../styles/carousel.css';

const Cards = ({ date, flightDetails, isSelected, onClick }) => {
    // Format the date for display in YYYY-MM-DD format
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const cardClass = isSelected ? 'card selected' : 'card';

    return (
        <div className={cardClass} onClick={onClick}>
            <p>{formattedDate}</p>
            {flightDetails ? (
                <>
                    {/* <p>{flightDetails.flight.flightNo || 'N/A'}</p> */}
                    <p>
                        PHP {((flightDetails.flight.route.distanceKM * flightDetails.pricing.distanceFactor) + flightDetails.pricing.basePrice).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                </>
            ) : (
                <p>No Available Flights</p>
            )}
        </div>
    );
};


const Carousel = ({ flights, departureDate, onDateSelect }) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [startIndex, setStartIndex] = useState(0); // Track the start index for visible cards

    // Generate a list of 30 dates before and 30 dates after the departure date, but not earlier than today
    const generateDates = (centerDate) => {
        const dates = [];
        const today = new Date(); // Current date
        const center = new Date(centerDate);

        // Generate 30 days before and after the departure date
        for (let i = -30; i <= 30; i++) {
            const newDate = new Date(center);
            newDate.setDate(center.getDate() + i);

            // Ensure the date is not earlier than today
            if (newDate >= today) {
                dates.push(newDate);
            }
        }

        return dates;
    };

    // Create cardsData and log each flight being processed
    const cardsData = generateDates(departureDate).map(date => {
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD for comparison
        console.log(`Processing date: ${formattedDate}`);
    
        // Find if there's a flight on this date
        const flightForDate = flights.find(flight => {
            if (!flight.date) {  // Use flight.date instead of flight.departureDate
                console.log('Invalid flight date found:', flight);
                return false;
            }
    
            // Directly compare the flight's date with the formatted date
            console.log(`Checking flightDate: ${flight.date} against ${formattedDate}`);
            return flight.date === formattedDate;
        });
    
        console.log(`Flight found for ${formattedDate}:`, flightForDate);
    
        return {
            date,
            flightDetails: flightForDate || null, // If no flight, set flightDetails to null
        };
    });
    

    // Determine the initial set of visible cards centered on the departure date
    const departureTimestamp = new Date(departureDate).getTime();
    const departureIndex = cardsData.findIndex(card => card.date.getTime() === departureTimestamp);

    // Set the initial selected card to the departure date and update the start index
    useEffect(() => {
        console.log(`Setting initial selected card for departure date: ${new Date(departureDate).toISOString().split('T')[0]}`);
        setSelectedCard(departureTimestamp);

        // Center the departure date within the visible cards
        let initialStartIndex = departureIndex - Math.floor(7 / 2);
        if (initialStartIndex < 0) {
            initialStartIndex = 0;
        }
        setStartIndex(initialStartIndex);
        console.log(`Initial start index set to: ${initialStartIndex}`);
    }, [departureTimestamp, departureIndex]);

    // Handle left button click
    const handleLeftClick = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    // Handle right button click
    const handleRightClick = () => {
        setStartIndex((prevIndex) => Math.min(prevIndex + 1, cardsData.length - 7));
    };

    // Slice the cardsData to show only the 7 cards around the startIndex
    const visibleCards = cardsData.slice(startIndex, startIndex + 7);

    const handleCardClick = (date) => {
        const dateTimestamp = date.getTime();
        const formattedDate = date.toISOString().split('T')[0];
        console.log(`Card clicked for date: ${formattedDate}, timestamp: ${dateTimestamp}`);
        setSelectedCard(dateTimestamp); // Update selected card
        onDateSelect(date); // Call the callback function to update the parent component
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
                            key={index}
                            date={card.date}
                            flightDetails={card.flightDetails} // Pass flight details to Cards
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
