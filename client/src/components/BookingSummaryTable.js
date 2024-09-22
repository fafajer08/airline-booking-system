import React, { useState } from 'react';

function BookingSummaryTable({ bookingData }) {
    // State to toggle flight details visibility
    const [showFlightDetails, setShowFlightDetails] = useState(true);

    // Function to handle toggle click
    const toggleFlightDetails = () => {
        setShowFlightDetails(!showFlightDetails);
    };

    // Destructure the bookingData for easy access
    const {
        commercialFlightId: flightDetails,
        passengerIds,
        seatClass,
        promoId,
    } = bookingData || {};

    console.log(bookingData);

    // Assuming flightDetails contains nested populated data like flight number, route, etc.
    const flightNumber = flightDetails?.flight?.flightNo || 'N/A';
    const departureAirport = flightDetails?.flight?.route?.departure?.airportCode || 'Unknown';
    const arrivalAirport = flightDetails?.flight?.route?.destination?.airportCode || 'Unknown';
    const departureDate = flightDetails?.date || 'N/A';
    const departureTime = flightDetails?.departureTime || 'N/A';
    const arrivalTime = flightDetails?.flight?.arrivalTime
        ? new Date(flightDetails.flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'N/A';

    // Assuming passengerIds contains an array of passenger objects
    const passengerList = passengerIds || [];
    const passengerCount = passengerList.length;

    // Placeholder for total cost (this could be calculated based on flight details and seat class)
    const totalCost = flightDetails?.pricing?.totalPrice || 'PHP 0.00';

    return (
        <div className="booking-summary-table-outer-container container p-5 m-5">
            {/* Flight route and time */}
            <div className="d-flex justify-content-between flight-summary px-5 mx-5 mb-5">
                <div className="flight-route">
                    <div>{departureAirport} - {arrivalAirport} on flight {flightNumber}</div>
                    <div>{departureDate} {departureTime} - {arrivalTime}</div>
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
                            <div>{arrivalTime}</div>
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
                <h4>
                    PHP {(
                        ((flightDetails.flight.route.distanceKM * flightDetails.pricing.distanceFactor) + flightDetails.pricing.basePrice) 
                        * passengerIds.length
                    ).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                    </h4>

            </div>
        </div>
    );
}

export default BookingSummaryTable;

// {((flightDetails.flight.route.distanceKM * flightDetails.pricing.distanceFactor) + flightDetails.pricing.basePrice).toLocaleString('en-US', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
// })}