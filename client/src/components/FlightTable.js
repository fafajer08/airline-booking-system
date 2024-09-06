import React, { useState } from 'react';
import { SelectButton } from './Buttons';
import '../styles/flighttable.css';
import flightsData from '../data/flightsData';

function FlightTable() {
  // Sample flight data for multiple flights
  const flights = [
    {
      departureTime: "08:30 AM",
      arrivalTime: "11:45 AM",
      flightNo: "AB123",
      price: 7500.00,
      remainingSeats: 5,
    },
    {
      departureTime: "09:00 AM",
      arrivalTime: "12:15 PM",
      flightNo: "BC234",
      price: 8200.00,
      remainingSeats: 3,
    },
    {
      departureTime: "10:15 AM",
      arrivalTime: "01:30 PM",
      flightNo: "CD345",
      price: 6800.00,
      remainingSeats: 8,
    },
    {
      departureTime: "11:00 AM",
      arrivalTime: "02:15 PM",
      flightNo: "DE456",
      price: 7700.00,
      remainingSeats: 2,
    },
    {
      departureTime: "12:45 PM",
      arrivalTime: "03:00 PM",
      flightNo: "EF567",
      price: 9000.00,
      remainingSeats: 4,
    },
    {
      departureTime: "01:30 PM",
      arrivalTime: "04:45 PM",
      flightNo: "FG678",
      price: 8500.00,
      remainingSeats: 6,
    },
    {
      departureTime: "02:00 PM",
      arrivalTime: "05:15 PM",
      flightNo: "GH789",
      price: 9300.00,
      remainingSeats: 7,
    },
    {
      departureTime: "03:30 PM",
      arrivalTime: "06:45 PM",
      flightNo: "HI890",
      price: 9500.00,
      remainingSeats: 1,
    },
    {
      departureTime: "04:00 PM",
      arrivalTime: "07:15 PM",
      flightNo: "IJ901",
      price: 7800.00,
      remainingSeats: 9,
    },
    {
      departureTime: "05:30 PM",
      arrivalTime: "08:45 PM",
      flightNo: "JK012",
      price: 8000.00,
      remainingSeats: 10,
    },
  ];

  // State to track the index of the selected flight
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);

  // Function to calculate duration between departure and arrival times
  const calculateDuration = (departureTime, arrivalTime) => {
    const formatTime = time => {
      const [hourMinute, modifier] = time.split(' ');
      let [hours, minutes] = hourMinute.split(':');
      if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }
      return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
    };

    const dep = formatTime(departureTime);
    const arr = formatTime(arrivalTime);

    const depTimeInMinutes = dep.hours * 60 + dep.minutes;
    const arrTimeInMinutes = arr.hours * 60 + arr.minutes;

    const durationInMinutes = arrTimeInMinutes - depTimeInMinutes;
    const durationHours = Math.floor(durationInMinutes / 60);
    const durationMinutes = durationInMinutes % 60;

    return `${durationHours}h ${durationMinutes}m`;
  };

  // Handler for selecting a flight and returning the flightNo
  const handleSelect = (index) => {
    setSelectedFlightIndex(index);
    const selectedFlightNo = flights[index].flightNo;
    console.log('Selected Flight No:', selectedFlightNo);
    // You can return the flightNo or perform any action with it
    return selectedFlightNo;
  };

  return (
    <div className="flight-table-container">
      <table className="flight-table">
        <thead>
          <tr>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Duration</th>
            <th>Flight No</th>
            <th>Price & Seats</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => {
            const flightDuration = calculateDuration(flight.departureTime, flight.arrivalTime);
            return (
              <tr key={index}>
                <td>{flight.departureTime}</td>
                <td>{flight.arrivalTime}</td>
                <td>{flightDuration}</td>
                <td>{flight.flightNo}</td>
                <td>PHP {flight.price.toLocaleString()} ({flight.remainingSeats} seats)</td>
                <td>
                  <SelectButton 
                    isSelected={selectedFlightIndex === index}
                    onClick={() => handleSelect(index)} 
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FlightTable;
