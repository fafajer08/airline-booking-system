import React from 'react';
import { SelectButton } from './Buttons';
import '../styles/flighttable.css';

function FlightTable({ selectedFlights = [], selectedFlightId, onSelectFlight }) {
  console.log('FlightTable received flights:', selectedFlights);

  // Function to format duration from minutes
  const formatDuration = (durationMins) => {
    const hours = Math.floor(durationMins / 60);
    const minutes = durationMins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flight-table-container">
      {selectedFlights.length === 0 ? (
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
              const flightDuration = flight.route && flight.route.durationMins 
                ? formatDuration(flight.route.durationMins) 
                : "N/A";
              
              const basePrice = flight.pricing && flight.pricing.basePrice ? flight.pricing.basePrice : 0;
              const departureTime = flight.departureTime || "N/A";
              const arrivalAirport = flight.flight.route && flight.flight.route.destination 
                ? flight.flight.route.destination.airportName 
                : "N/A";

              const isSelected = selectedFlightId === flight._id;

              return (
                <tr key={flight._id} className={isSelected ? 'selected' : ''}>
                  <td>{departureTime}</td>
                  <td>{arrivalAirport}</td>
                  <td>{flightDuration}</td>
                  <td>{flight.flight.flightNo}</td>
                  <td>PHP {basePrice.toLocaleString()} ({flight.availableSeats.totalSeats} seats)</td>
                  <td>
                    <SelectButton 
                      isSelected={isSelected}
                      onClick={() => onSelectFlight(flight._id)} 
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
