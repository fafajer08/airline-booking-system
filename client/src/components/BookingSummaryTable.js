// import React from 'react';

// function BookingSummaryTable() {
//     return (
//         <div className="booking-summary-table-outer-container container p-5 m-5">
//             {/* Flight route and time */}
//             <div className="d-flex justify-content-between flight-summary px-5 mx-5 mb-5">
//                 <div className="flight-route">
//                     <div>DVO-MNL via CEB</div>
//                     <div>27 Aug 2024 05:00 AM - 6:20 AM</div>
//                 </div>
//                 <div className="toggle-details">Hide flight details</div>
//             </div>

//             {/* Flight details */}
//             <div className="flight-details px-5 mx-5 mb-5">
//                 <div className="flight-info d-flex mb-5">
//                     <div className="pe-5">
//                         <div>27 Aug 2024</div>
//                         <div>05:00 AM</div>
//                     </div>
//                     <div>
//                         <div>DEPARTURE - FLIGHT NO SX 460</div>
//                         <div>DAVAO - Francisco Bangoy International Airport</div>
//                     </div>
//                 </div>
//                 <div className="flight-info d-flex mb-5">
//                     <div className="pe-5">
//                         <div>27 Aug 2024</div>
//                         <div>06:20 AM</div>
//                     </div>
//                     <div>
//                         <div>ARRIVAL - FLIGHT NO SX 460</div>
//                         <div>MANILA - Ninoy Aquino International Airport</div>
//                     </div>
//                 </div>
//             </div>

//             {/* Passenger information */}
//             <div className="passenger-info px-5 mx-5 mb-5">
//                 <h5>Juan Dela Cruz</h5>
//             </div>

//             {/* Total cost */}
//             <div className="d-flex justify-content-between total-summary px-5 mx-5">
//                 <h4>Total</h4>
//                 <h4 className=''>PHP 7,500</h4>
//             </div>
//         </div>
//     );
// }

// export default BookingSummaryTable;

import React from 'react';

function BookingSummaryTable({ bookingData }) {

    console.log('Received bookingData:', bookingData);

    // Destructure the bookingData for easy access
    const {
        commercialFlightId: flightDetails,
        passengerIds,
        seatClass,
        promoId,
    } = bookingData || {};

    // Assuming flightDetails contains nested populated data like flight number, route, etc.
    const flightNumber = flightDetails?.flight?.flightNo || 'N/A';
    const departureAirport = flightDetails?.flight?.route?.departure?.airportCode || 'Unknown';
    const arrivalAirport = flightDetails?.flight?.route?.destination?.airportCode || 'Unknown';
    const departureDate = flightDetails?.date || 'N/A';
    const departureTime = flightDetails?.departureTime || 'N/A';
    const arrivalTime = flightDetails?.flight?.arrivalTime ? new Date(flightDetails.flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

    // Assuming passengerIds contains an array of passenger objects
    const passengerList = passengerIds || [];

    // Placeholder for total cost (this could be calculated based on flight details and seat class)
    const totalCost = flightDetails?.pricing?.totalPrice || 'PHP 0.00';

    return (
        <div className="booking-summary-table-outer-container container p-5 m-5">
            {/* Flight route and time */}
            <div className="d-flex justify-content-between flight-summary px-5 mx-5 mb-5">
                <div className="flight-route">
                    <div>{departureAirport} - {arrivalAirport} via {flightNumber}</div>
                    <div>{departureDate} {departureTime} - {arrivalTime}</div>
                </div>
                <div className="toggle-details">Hide flight details</div>
            </div>

            {/* Flight details */}
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

            {/* Passenger information */}
            <div className="passenger-info px-5 mx-5 mb-5">
                {passengerList.length > 0 ? (
                    passengerList.map((passenger, index) => (
                        <h5 key={index}>{passenger.firstName} {passenger.lastName}</h5>
                    ))
                ) : (
                    <h5>No passengers available</h5>
                )}
            </div>

            {/* Total cost */}
            <div className="d-flex justify-content-between total-summary px-5 mx-5">
                <h4>Total</h4>
                <h4>{totalCost}</h4>
            </div>
        </div>
    );
}

export default BookingSummaryTable;
