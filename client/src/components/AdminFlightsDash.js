import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import '../styles/admin.css';  // Import the CSS file

export default function AdminFlightsDash() {
  const [flights, setFlights] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");

  // Mock flight data with initial status
  const mockFlights = [
    {
      departureDate: "2024-09-15",
      departureAirport: "JFK",
      destinationAirport: "LAX",
      departureTime: "14:00",
      flightNumber: "AA123",
      seats: 200,
      booked: 150,
      status: "On Time",
      actionStatus: "", // Empty status initially
    },
    {
      departureDate: "2024-09-16",
      departureAirport: "ORD",
      destinationAirport: "ATL",
      departureTime: "18:30",
      flightNumber: "DL456",
      seats: 180,
      booked: 180,
      status: "Full",
      actionStatus: "", // Empty status initially
    },
    {
      departureDate: "2024-09-17",
      departureAirport: "SFO",
      destinationAirport: "SEA",
      departureTime: "08:00",
      flightNumber: "UA789",
      seats: 150,
      booked: 120,
      status: "Delayed",
      actionStatus: "", // Empty status initially
    },
  ];

  useEffect(() => {
    // Fetching from API or using mock data
    async function fetchFlights() {
      try {
        const response = await fetch("/api/flights");
        if (response.ok) {
          const data = await response.json();
          setFlights(data);
        } else {
          setFlights(mockFlights); // Use mock data if API fails
        }
      } catch (error) {
        setFlights(mockFlights); // Use mock data if API fails
      }
    }
    fetchFlights();
  }, []);

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedFlights = React.useMemo(() => {
    let sortableFlights = [...flights];
    if (sortConfig.key !== null) {
      sortableFlights.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFlights;
  }, [flights, sortConfig]);

  // Filter the flights based on search query
  const filteredFlights = sortedFlights.filter((flight) =>
    flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.departureAirport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.destinationAirport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Action button handlers with confirmation and row color change
  const updateFlightStatus = (flightNumber, status) => {
    setFlights((prevFlights) =>
      prevFlights.map((flight) =>
        flight.flightNumber === flightNumber
          ? { ...flight, actionStatus: status }
          : flight
      )
    );
  };

  const handleCancel = (flightNumber) => {
    if (window.confirm(`Are you sure you want to cancel flight ${flightNumber}?`)) {
      updateFlightStatus(flightNumber, "cancel");
    }
  };

  const handleHold = (flightNumber) => {
    if (window.confirm(`Are you sure you want to hold flight ${flightNumber}?`)) {
      updateFlightStatus(flightNumber, "hold");
    }
  };

  const handleOk = (flightNumber) => {
    if (window.confirm(`Are you sure you want to mark flight ${flightNumber} as OK?`)) {
      updateFlightStatus(flightNumber, "ok");
    }
  };

  // Function to get the CSS class based on status
  const getRowClass = (actionStatus) => {
    switch (actionStatus) {
      case "cancel":
        return "row-cancel"; // Light red tint
      case "hold":
        return "row-hold"; // Light yellow tint
      case "ok":
        return "row-ok"; // Light green tint
      default:
        return "row-default"; // Default row color
    }
  };

  return (
    <div>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by flight number, airport, or status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("departureDate")}>DEPARTURE DATE</th>
              <th onClick={() => handleSort("departureAirport")}>DEPARTURE AIRPORT</th>
              <th onClick={() => handleSort("destinationAirport")}>DESTINATION AIRPORT</th>
              <th onClick={() => handleSort("departureTime")}>DEPARTURE TIME</th>
              <th onClick={() => handleSort("flightNumber")}>FLIGHT NUMBER</th>
              <th onClick={() => handleSort("seats")}>SEATS</th>
              <th onClick={() => handleSort("booked")}>BOOKED</th>
              <th onClick={() => handleSort("status")}>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight, index) => (
                <tr key={index} className={getRowClass(flight.actionStatus)}>
                  <td>{flight.departureDate}</td>
                  <td>{flight.departureAirport}</td>
                  <td>{flight.destinationAirport}</td>
                  <td>{flight.departureTime}</td>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.seats}</td>
                  <td>{flight.booked}</td>
                  <td>{flight.status}</td>
                  <td>
                    <button onClick={() => handleCancel(flight.flightNumber)}>Cancel</button>
                    <button onClick={() => handleHold(flight.flightNumber)}>Hold</button>
                    <button onClick={() => handleOk(flight.flightNumber)}>OK</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No flights available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

  );
}

