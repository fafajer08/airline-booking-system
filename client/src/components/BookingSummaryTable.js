import React, { useState } from 'react';

function BookingSummaryTable({ bookingData }) {
    // State to toggle flight details visibility
    const [showFlightDetails, setShowFlightDetails] = useState(false);

    // Function to handle toggle click
    const toggleFlightDetails = () => {
        setShowFlightDetails(!showFlightDetails);
    };

    console.log(`booking Data booking table`, bookingData);
    // Destructure the bookingData for easy access
    const {
        user,
        selectedFlight,
        seatClass,
        promo,
        finalGuests,
        fare
    } = bookingData || {};

    console.log(bookingData);

    // Assuming flightDetails contains nested populated data like flight number, route, etc.
    const flightNumber = selectedFlight?.flight?.flightNo || 'N/A';
    const departureAirport = selectedFlight?.flight?.route?.departure?.airportCode || 'Unknown';
    const arrivalAirport = selectedFlight?.flight?.route?.destination?.airportCode || 'Unknown';
    const departureDate = selectedFlight?.date || 'N/A';
    const departureTime = selectedFlight?.departureTime || 'N/A';
    const duration = selectedFlight?.flight?.route?.durationMins || 'N/A';


    // Assuming passengerIds contains an array of passenger objects
    const passengerList = finalGuests || [];
    const passengerCount = passengerList.length;

    // Placeholder for total cost (this could be calculated based on flight details and seat class)
    const addTime = (departureTime, durationMins) => {
        const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
        const durationHours = Math.floor(durationMins / 60);
        const durationRemainingMinutes = durationMins % 60;
    
        let totalHours = departureHours + durationHours;
        let totalMinutes = departureMinutes + durationRemainingMinutes;
    
        if (totalMinutes >= 60) {
          totalHours += Math.floor(totalMinutes / 60);
          totalMinutes = totalMinutes % 60;
        }
    
        totalHours = totalHours % 24;
    
        const formattedHours = totalHours.toString().padStart(2, '0');
        const formattedMinutes = totalMinutes.toString().padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}`;
      };
      

    return (
        <div className="booking-summary-table-outer-container container p-5 m-5">
            {/* Flight route and time */}
            <div className="d-flex justify-content-between flight-summary px-5 mx-5 mb-5">
                <div className="flight-route">
                    <div>{departureAirport} - {arrivalAirport} on flight {flightNumber}</div>
                    <div>{departureDate} {departureTime} - {addTime(departureTime, duration)}</div>
                </div>
                {/* Toggle button for flight details */}
                <div className="toggle-details" onClick={toggleFlightDetails} style={{ cursor: 'pointer' }}>
                    {showFlightDetails ? 'Hide flight details' : 'Show flight details'}
                </div>
            </div>

            {/* Conditionally render flight details based on state */}
            {showFlightDetails && (
                <div className="flight-details px-5 mx-5 mb-5">
                    <div className="flight-info d-flex mb-5">
                        <div className="pe-5">
                            <div>{departureDate}</div>
                            <div>{departureTime}</div>
                        </div>
                        <div>
                            <div>DEPARTURE - FLIGHT NO {flightNumber}</div>
                            <div>{departureAirport}</div>
                        </div>
                    </div>
                    <div className="flight-info d-flex mb-5">
                        <div className="pe-5">
                            <div>{departureDate}</div>
                            <div>{addTime(departureTime, duration)}</div>
                        </div>
                        <div>
                            <div>ARRIVAL - FLIGHT NO {flightNumber}</div>
                            <div>{arrivalAirport}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Passenger information */}
            <div className="passenger-info px-5 mx-5 mb-5">
                {passengerCount > 0 ? (
                    <>
                        <h5>For {passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'}:</h5>
                        {passengerList.map((passenger, index) => (
                            <h5 key={index}>{passenger.firstName} {passenger.lastName}</h5>
                        ))}
                    </>
                ) : (
                    <h5>No passengers available</h5>
                )}
            </div>

            {/* Total cost */}
            <div className="d-flex justify-content-between total-summary px-5 mx-5">
                <h4>Total</h4>
                <h4>PHP {fare}</h4>
            </div>
        </div>
    );
}

export default BookingSummaryTable;

