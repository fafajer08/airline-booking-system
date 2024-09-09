import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import mockFlights from '../data/flightsData';
import '../styles/adminflights.css';  // Ensure your styles are being used correctly

export default function AdminFlightsDash() {
  const [flights, setFlights] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    departureDate: "",
    departureAirport: "",
    destinationAirport: "",
    departureTime: "",
    flightNo: "",
    seats: "",
    bookedSeats: "",
    status: "",
  });

  useEffect(() => {
    setFlights(mockFlights); // Use mock data until the backend is ready
  }, []);

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Helper function for sorting
  const getSortedFlights = () => {
    const sortedFlights = [...flights];
    if (sortConfig.key) {
      sortedFlights.sort((a, b) => {
        const aValue = sortConfig.key.includes('.')
          ? a[sortConfig.key.split('.')[0]][sortConfig.key.split('.')[1]]
          : a[sortConfig.key];
        const bValue = sortConfig.key.includes('.')
          ? b[sortConfig.key.split('.')[0]][sortConfig.key.split('.')[1]]
          : b[sortConfig.key];
          
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedFlights;
  };

  // Filter the flights based on search inputs
  const filteredFlights = getSortedFlights().filter((flight) =>
    Object.keys(columnSearch).every((key) => {
      const flightValue = flight[key];
  
      // Ensure flightValue is a string before applying .toLowerCase()
      if (flightValue && typeof flightValue === "string") {
        return flightValue.toLowerCase().includes(columnSearch[key].toLowerCase());
      }
  
      // If flightValue is not a string, just return true (or you can add logic to filter numbers)
      return true; 
    })
  );

  const paginatedFlights = filteredFlights.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredFlights.length / rowsPerPage);

  // Handle row click to show modal
  const handleRowClick = (flight) => {
    setSelectedFlight(flight);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "▲" : "▼";
  };

  const handleHeaderClick = (key) => {
    handleSort(key);
  };

  // Helper for rendering table headers with sorting and search
  const renderTableHeader = (label, key) => (
    <th onClick={() => handleHeaderClick(key)}>
      {label} {renderSortArrow(key)}
      <input
        type="text"
        value={columnSearch[key] || ""}
        onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
        placeholder={`Search ${label}`}
        className="table-search-input"
      />
    </th>
  );

  return (
    <div className="admin-flights-dash">
      {/* Search Input and Rows per Page */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by flight number, airport, or status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Flights Table */}
      <table>
        <thead>
          <tr>
            {renderTableHeader("DEPARTURE DATE", "departureDate")}
            {renderTableHeader("DEPARTURE AIRPORT", "departureAirport.code")}
            {renderTableHeader("DESTINATION AIRPORT", "destinationAirport.code")}
            {renderTableHeader("DEPARTURE TIME", "departureTime")}
            {renderTableHeader("FLIGHT NUMBER", "flightNo")}
            {renderTableHeader("SEATS", "airline.totalSeats")}
            {renderTableHeader("BOOKED", "bookedSeats")}
            {renderTableHeader("STATUS", "status")}
          </tr>
        </thead>
        <tbody>
          {paginatedFlights.length > 0 ? (
            paginatedFlights.map((flight, index) => (
              <tr key={index} onClick={() => handleRowClick(flight)}>
                <td>{flight.departureDate}</td>
                <td>{flight.departureAirport.code} ({flight.departureAirport.city})</td>
                <td>{flight.destinationAirport.code} ({flight.destinationAirport.city})</td>
                <td>{flight.departureTime}</td>
                <td>{flight.flightNo}</td>
                <td>{flight.airline.totalSeats}</td>
                <td>{flight.bookedSeats}</td>
                <td>{flight.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No flights available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>

      {/* Modal for Flight Details */}
      {selectedFlight && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Flight Details - {selectedFlight.flightNo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Airline:</strong> {selectedFlight.airline.name}</p>
            <p><strong>Departure Airport:</strong> {selectedFlight.departureAirport.name} ({selectedFlight.departureAirport.code})</p>
            <p><strong>Destination Airport:</strong> {selectedFlight.destinationAirport.name} ({selectedFlight.destinationAirport.code})</p>
            <p><strong>Departure Date:</strong> {selectedFlight.departureDate}</p>
            <p><strong>Departure Time:</strong> {selectedFlight.departureTime}</p>
            <p><strong>Arrival Time:</strong> {selectedFlight.arrivalTime}</p>
            <p><strong>Total Seats:</strong> {selectedFlight.airline.totalSeats}</p>
            <p><strong>Booked Seats:</strong> {selectedFlight.bookedSeats}</p>
            <p><strong>Status:</strong> {selectedFlight.status}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
