import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import mockFlights from '../data/flightsData'; // Assuming mock data is available

export default function DestinationDetails() {
  const { destination } = useParams(); // Get the destination from the route params
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // Filter flights by departure airport (the destination name)
    const filteredFlights = mockFlights.filter(flight => flight.departureAirport.name === destination);
    setFlights(filteredFlights);
  }, [destination]);

  return (
    <div>
      <h2>{destination} Flights</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Departure Time</th>
            <th>Seats Available</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => (
            <tr key={index}>
              <td>{flight.flightNumber}</td>
              <td>{flight.departureTime}</td>
              <td>{flight.seats - flight.booked}</td>
              <td>{flight.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
