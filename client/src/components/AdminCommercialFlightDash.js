import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/admincomponentsdash.css';

export default function CommercialFlights() {
  const notyf = new Notyf({ duration: 3000 });
  const [commercialFlights, setCommercialFlights] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch flights and commercial flights from the backend
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/all`);
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    const fetchCommercialFlights = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/all`);
        const data = await response.json();
        setCommercialFlights(data);
      } catch (error) {
        console.error('Error fetching commercial flights:', error);
      }
    };

    fetchFlights();
    fetchCommercialFlights();
  }, []);

  // Handle modal open/close
  const handleCloseAddModal = () => setAddModalVisible(false);
  const handleOpenAddModal = () => setAddModalVisible(true);

  // Handle input change for date range
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle generating commercial flights
  const handleGenerateCommercialFlights = async () => {
    if (!selectedFlight || !dateRange.start || !dateRange.end) {
      notyf.error("Please select a flight and date range.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flightId: selectedFlight, dateRange }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to generate commercial flights: ${response.status} ${responseData.message}`);
      }

      notyf.success("Commercial flights generated successfully.");
      setCommercialFlights((prev) => [...prev, ...responseData]);
      setAddModalVisible(false);
    } catch (error) {
      console.error('Error generating commercial flights:', error);
      notyf.error('Error generating commercial flights.');
    }
  };

  const paginatedCommercialFlights = commercialFlights.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(commercialFlights.length / rowsPerPage);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleOpenAddModal}>Add Commercial Flight</Button>
        <select
          className='ms-auto'
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Flight No</th>
            <th>Departure</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCommercialFlights.length > 0 ? (
            paginatedCommercialFlights.map((commercialFlight) => (
              <tr key={commercialFlight._id}>
                <td>{commercialFlight.flightNo}</td>
                <td>{commercialFlight.departureCity} - {commercialFlight.departureCode}</td>
                <td>{commercialFlight.destinationCity} - {commercialFlight.destinationCode}</td>
                <td>{new Date(commercialFlight.date).toLocaleDateString()}</td>
                <td>{commercialFlight.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No commercial flights available</td>
            </tr>
          )}
        </tbody>
      </table>

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

      {/* Modal for Adding Commercial Flights */}
      <Modal show={isAddModalVisible} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Commercial Flights</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="flight" className="form-label">Flight</label>
              <select
                className="form-select"
                id="flight"
                name="flight"
                value={selectedFlight || ""}
                onChange={(e) => setSelectedFlight(e.target.value)}
                required
              >
                <option value="">Select Flight</option>
                {flights.map((flight) => (
                  <option key={flight._id} value={flight._id}>
                    {flight.flightNo} - {flight.route.departure.airportCity} to {flight.route.destination.airportCity}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="start" className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="start"
                name="start"
                value={dateRange.start}
                onChange={handleDateRangeChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="end" className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                id="end"
                name="end"
                value={dateRange.end}
                onChange={handleDateRangeChange}
                required
              />
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleGenerateCommercialFlights}>
                Generate
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
