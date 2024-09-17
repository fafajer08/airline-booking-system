// import React, { useState } from 'react';
// import { SelectButton } from './Buttons';
// import '../styles/flighttable.css';
// import flightsData from '../data/flightsData';

// function FlightTable() {
//   // Sample flight data for multiple flights
 
//   // State to track the index of the selected flight
//   const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);

//   // Function to calculate duration between departure and arrival times
//   const calculateDuration = (departureTime, arrivalTime) => {
//     const formatTime = time => {
//       const [hourMinute, modifier] = time.split(' ');
//       let [hours, minutes] = hourMinute.split(':');
//       if (modifier === 'PM' && hours !== '12') {
//         hours = parseInt(hours, 10) + 12;
//       }
//       if (modifier === 'AM' && hours === '12') {
//         hours = '00';
//       }
//       return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
//     };

//     const dep = formatTime(departureTime);
//     const arr = formatTime(arrivalTime);

//     const depTimeInMinutes = dep.hours * 60 + dep.minutes;
//     const arrTimeInMinutes = arr.hours * 60 + arr.minutes;

//     const durationInMinutes = arrTimeInMinutes - depTimeInMinutes;
//     const durationHours = Math.floor(durationInMinutes / 60);
//     const durationMinutes = durationInMinutes % 60;

//     return `${durationHours}h ${durationMinutes}m`;
//   };

//   // Handler for selecting a flight and returning the flightNo
//   const handleSelect = (index) => {
//     setSelectedFlightIndex(index);
//     const selectedFlightNo = flights[index].flightNo;
//     console.log('Selected Flight No:', selectedFlightNo);
//     // You can return the flightNo or perform any action with it
//     return selectedFlightNo;
//   };

//   return (
//     <div className="flight-table-container">
//       <table className="flight-table">
//         <thead>
//           <tr>
//             <th>Departure Time</th>
//             <th>Arrival Time</th>
//             <th>Duration</th>
//             <th>Flight No</th>
//             <th>Price & Seats</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {flights.map((flight, index) => {
//             const flightDuration = calculateDuration(flight.departureTime, flight.arrivalTime);
//             return (
//               <tr key={index}>
//                 <td>{flight.departureTime}</td>
//                 <td>{flight.arrivalTime}</td>
//                 <td>{flightDuration}</td>
//                 <td>{flight.flightNo}</td>
//                 <td>PHP {flight.price.toLocaleString()} ({flight.remainingSeats} seats)</td>
//                 <td>
//                   <SelectButton 
//                     isSelected={selectedFlightIndex === index}
//                     onClick={() => handleSelect(index)} 
//                   />
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default FlightTable;

import React, { useState } from 'react';
import { SelectButton } from './Buttons';
import '../styles/flighttable.css';

function FlightTable({ selectedFlights = [] }) { // Use the selectedFlights prop directly
  // State to track the index of the selected flight
  const [selectedFlightId, setSelectedFlightId] = useState(null);

  console.log('FlightTable received flights:', selectedFlights); // Log received flights

  // Function to format duration from minutes
  const formatDuration = (durationMins) => {
    const hours = Math.floor(durationMins / 60);
    const minutes = durationMins % 60;
    return `${hours}h ${minutes}m`;
  };

  // Handler for selecting a flight
  const handleSelect = (flightId) => {
    setSelectedFlightId(flightId);
    console.log('Selected Flight Id:', flightId);
    return flightId;
  };

  return (
    <div className="flight-table-container">
      {selectedFlights.length === 0 ? ( // Check if selectedFlights is empty
        <p>No available flights.</p>
      ) : (
        <table className="flight-table">
          <thead>
            <tr>
              <th>Departure Time</th>
              <th>Arrival Airport</th>
              <th>Duration</th>
              <th>Flight No</th>
              <th>Price & Seats</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {selectedFlights.map((flight) => {
              // Extract duration in minutes from the route object and format it
              const flightDuration = flight.route && flight.route.durationMins 
                ? formatDuration(flight.route.durationMins) 
                : "N/A";
              
              // Extract pricing information
              const basePrice = flight.pricing && flight.pricing.basePrice ? flight.pricing.basePrice : 0;

              // Format departure and arrival information
              const departureTime = flight.departureTime || "N/A";
              const arrivalAirport = flight.flight.route && flight.flight.route.destination 
                ? flight.flight.route.destination.airportName 
                : "N/A";

              return (
                <tr key={flight._id}>
                  <td>{departureTime}</td>
                  <td>{arrivalAirport}</td>
                  <td>{flightDuration}</td>
                  <td>{flight.flight.flightNo}</td>
                  <td>PHP {basePrice.toLocaleString()} ({flight.availableSeats.totalSeats} seats)</td>
                  <td>
                    <SelectButton 
                      isSelected={selectedFlightId === flight._id}
                      onClick={() => handleSelect(flight._id)} 
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FlightTable;
