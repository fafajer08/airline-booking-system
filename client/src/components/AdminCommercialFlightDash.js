import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/admincomponentsdash.css';
import '../styles/admincommercialflightdash.css';

export default function CommercialFlights() {
  const notyf = new Notyf({ duration: 3000 });

  // State variables
  const [commercialFlights, setCommercialFlights] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedFlightDetails, setSelectedFlightDetails] = useState(null);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [addingCommercialFlight, setAddingCommercialFlight] = useState(false);
  const [togglingCommercialFlightId, setTogglingCommercialFlightId] = useState(null);
  const [columnSearch, setColumnSearch] = useState({
    'flight.flightNo': '',
    'flight.route.departure.airportCity': '',
    'flight.route.destination.airportCity': '',
    'departureTime': '',
    'date': '',
    'availableSeats.totalSeats': '',
    'isActive': ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [flightsRes, commercialFlightsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/flights/all`),
          fetch(`${process.env.REACT_APP_API_URL}/commercialflights/all`)
        ]);

        if (!flightsRes.ok || !commercialFlightsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const flightsData = await flightsRes.json();
        const commercialFlightsData = await commercialFlightsRes.json();

        setFlights(Array.isArray(flightsData) ? flightsData : []);
        setCommercialFlights(Array.isArray(commercialFlightsData) ? commercialFlightsData : []);
        notyf.success("Data fetched successfully.");
      } catch (error) {
        notyf.error('There was a problem fetching data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Sorting functions
  const handleSort = (keysArray) => {
    const key = keysArray.join('.');
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getNestedValue = (object, keysArray) => {
    return keysArray.reduce((acc, key) => (acc ? acc[key] : undefined), object);
  };

  const getSortedCommercialFlights = () => {
    const sortedFlights = Array.isArray(commercialFlights) ? [...commercialFlights] : [];
    if (sortConfig.key) {
      sortedFlights.sort((a, b) => {
        const keysArray = sortConfig.key.split('.');
        const aValue = getNestedValue(a, keysArray);
        const bValue = getNestedValue(b, keysArray);

        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedFlights;
  };

  // Filtering
  const filteredCommercialFlights = getSortedCommercialFlights().filter((flight) =>
    Object.keys(columnSearch).every((key) => {
      const searchValue = columnSearch[key].trim();
      if (!searchValue) return true;

      const flightValue = getNestedValue(flight, key.split('.'));

      if (key === 'date' && flightValue) {
        // Format the date to "YYYY-MM-DD" for comparison
        const formattedDate = new Date(flightValue).toISOString().split('T')[0];
        return formattedDate.includes(searchValue);
      }

      if (typeof flightValue === 'string') {
        return flightValue.toLowerCase().includes(searchValue.toLowerCase());
      }
      if (typeof flightValue === 'number') {
        return flightValue.toString().includes(searchValue);
      }
      if (typeof flightValue === 'boolean') {
        return flightValue.toString() === searchValue;
      }
      return false;
    })
  );

  // Pagination
  const paginatedCommercialFlights = filteredCommercialFlights.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredCommercialFlights.length / rowsPerPage);

  // Modal handlers
  const handleCloseAddModal = () => setAddModalVisible(false);
  const handleOpenAddModal = () => {
    setSelectedFlight(null);
    setDateRange({ start: "", end: "" });
    setAddModalVisible(true);
  };

  const handleCloseDetailsModal = () => setDetailsModalVisible(false);
  const handleOpenDetailsModal = (flight) => {
    setSelectedFlightDetails(flight);
    setDetailsModalVisible(true);
  };

  // Handle date range input
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search inputs
  const renderTableSearch = (key, type) => (
    <td>
      {type === 'date' ? (
        <input
          type="date"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          className="table-search-input"
        />
      ) : type === 'number' ? (
        <input
          type="number"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          className="table-search-input"
        />
      ) : type === 'boolean' ? (
        <select
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          className="table-search-input"
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      ) : (
        <input
          type="text"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder={`Search`}
          className="table-search-input"
        />
      )}
    </td>
  );

  // Render table headers with sorting
  const renderTableHeader = (label, keysArray) => {
    const key = keysArray.join('.');
    return (
      <th onClick={() => handleSort(keysArray)} style={{ cursor: 'pointer' }}>
        {label} {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
      </th>
    );
  };

  // Toggle isActive status
  const toggleIsActive = async (id, isActive) => {
    setTogglingCommercialFlightId(id);
    const action = isActive ? 'archive' : 'activate';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/${id}/${action}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setCommercialFlights((prevFlights) => 
          prevFlights.map((flight) => 
            flight._id === id ? { ...flight, isActive: !flight.isActive } : flight
          )
        );
        notyf.success(`Commercial flight ${isActive ? 'deactivated' : 'activated'} successfully.`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} the commercial flight.`);
      }
    } catch (error) {
      notyf.error(`Error: ${error.message}`);
      console.error(`There was a problem with the ${action} operation:`, error);
    } finally {
      setTogglingCommercialFlightId(null);
    }
  };

  // Handle generating commercial flights
  const handleGenerateCommercialFlights = async () => {
    if (!selectedFlight || !dateRange.start || !dateRange.end) {
      notyf.error("Please select a flight and date range.");
      return;
    }

    setAddingCommercialFlight(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/multiple`, {
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
      setCommercialFlights((prev) => [...prev, ...responseData.added]);
      setAddModalVisible(false);
      setSelectedFlight(null);
      setDateRange({ start: "", end: "" });
    } catch (error) {
      console.error('Error generating commercial flights:', error);
      notyf.error('Error generating commercial flights.');
    } finally {
      setAddingCommercialFlight(false);
    }
  };

  // Handle clearing search filters
  const handleClearSearch = () => {
    setColumnSearch({
      'flight.flightNo': '',
      'flight.route.departure.airportCity': '',
      'flight.route.destination.airportCity': '',
      'departureTime': '',
      'date': '',
      'availableSeats.totalSeats': '',
      'isActive': ''
    });
    notyf.success("Search filters cleared.");
  };

  return (
    <div className="dash-container">
      {/* Loading spinner */}
      {loadingData && (
        <div className="spinner-overlay">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleOpenAddModal} disabled={loadingData}>
          Add Commercial Flight
        </Button>
        <Button variant="secondary" onClick={handleClearSearch} className="ms-2" disabled={loadingData}>
          Clear Search
        </Button>
        <select
          className='ms-auto'
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          disabled={loadingData}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {loadingData ? null : (
        <table>
          <thead>
            <tr>
              {renderTableHeader("Flight No", ["flight", "flightNo"])}
              {renderTableHeader("Departure", ["flight", "route", "departure", "airportCity"])}
              {renderTableHeader("Destination", ["flight", "route", "destination", "airportCity"])}
              {renderTableHeader("Departure Time", ["departureTime"])}
              {renderTableHeader("Date", ["date"])}
              {renderTableHeader("Total Seats", ["availableSeats", "totalSeats"])}
              {renderTableHeader("Status", ["isActive"])}
              <th>Action</th>
            </tr>
            <tr>
              {renderTableSearch("flight.flightNo", "text")}
              {renderTableSearch("flight.route.departure.airportCity", "text")}
              {renderTableSearch("flight.route.destination.airportCity", "text")}
              {renderTableSearch("departureTime", "text")}
              {renderTableSearch("date", "date")}
              {renderTableSearch("availableSeats.totalSeats", "number")}
              {renderTableSearch("isActive", "boolean")}
              <td></td>
            </tr>
          </thead>
          <tbody>
            {paginatedCommercialFlights.length > 0 ? (
              paginatedCommercialFlights.map((commercialFlight) => (
                <tr key={commercialFlight._id} onClick={() => handleOpenDetailsModal(commercialFlight)}>
                  <td>{commercialFlight.flight.flightNo}</td>
                  <td>{commercialFlight.flight.route.departure.airportCity}</td>
                  <td>{commercialFlight.flight.route.destination.airportCity}</td>
                  <td>{commercialFlight.departureTime}</td>
                  <td>{new Date(commercialFlight.date).toLocaleDateString()}</td>
                  <td>{commercialFlight.availableSeats.totalSeats}</td>
                  <td>
                    <Button
                      className="action-button"
                      variant={commercialFlight.isActive ? "success" : "danger"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleIsActive(commercialFlight._id, commercialFlight.isActive);
                      }}
                      disabled={togglingCommercialFlightId === commercialFlight._id}
                    >
                      {togglingCommercialFlightId === commercialFlight._id ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        commercialFlight.isActive ? "Active" : "Inactive"
                      )}
                    </Button>
                  </td>
                  <td>
                    {/* You can add more actions here if needed */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No commercial flights available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loadingData && filteredCommercialFlights.length > 0 && (
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
      )}

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
                {Array.isArray(flights) && flights.map((flight) => (
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
              <Button variant="primary" onClick={handleGenerateCommercialFlights} disabled={addingCommercialFlight}>
                {addingCommercialFlight ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal for Flight Details */}
      {selectedFlightDetails && (
        <Modal show={isDetailsModalVisible} onHide={handleCloseDetailsModal}>
          <Modal.Header closeButton>
            <Modal.Title>Commercial Flight Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Display detailed information about the selected commercial flight */}
            {/* Similar to the template's details modal */}
            <div className="flight-details-container">
              {/* Flight Information Section */}
              <div className="flight-details-section full-width">
                <div className="flight-details-section-header">Flight Information</div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Flight No:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.flight.flightNo}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Date:</span>
                  <span className="flight-detail-value">{new Date(selectedFlightDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Departure Time:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.departureTime}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Status:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>

              {/* Route Information Section */}
              <div className="flight-details-section">
                <div className="flight-details-section-header">Route Information</div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Departure:</span>
                  <span className="flight-detail-value">
                    {selectedFlightDetails.flight.route.departure.airportCity} - {selectedFlightDetails.flight.route.departure.airportCode}
                  </span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Destination:</span>
                  <span className="flight-detail-value">
                    {selectedFlightDetails.flight.route.destination.airportCity} - {selectedFlightDetails.flight.route.destination.airportCode}
                  </span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Distance (KM):</span>
                  <span className="flight-detail-value">{selectedFlightDetails.flight.route.distanceKM || "N/A"}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Duration (mins):</span>
                  <span className="flight-detail-value">{selectedFlightDetails.flight.route.durationMins || "N/A"}</span>
                </div>
              </div>

              {/* Airplane Details Section */}
              <div className="flight-details-section">
                <div className="flight-details-section-header">Airplane Details</div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Airline:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.flight.airplane.airlineName}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Model:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.flight.airplane.model}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Total Seats:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.flight.airplane.totalSeats}</span>
                </div>
              </div>

              {/* Available Seats Section */}
              <div className="flight-details-section">
                <div className="flight-details-section-header">Available Seats</div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">First Class:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.availableSeats.firstClass}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Business Class:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.availableSeats.businessSeat}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Premium Economy:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.availableSeats.premiumSeat}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Economy:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.availableSeats.economySeat}</span>
                </div>
              </div>

              {/* Pricing Details Section */}
              <div className="flight-details-section">
                <div className="flight-details-section-header">Pricing Details</div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Base Price:</span>
                  <span className="flight-detail-value">{selectedFlightDetails.pricing?.basePrice}</span>
                </div>
                {/* Add more pricing details as needed */}
              </div>

              {/* Additional Details Section */}
              <div className="flight-details-section full-width">
                <div className="flight-details-section-header">Additional Details</div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Created At:</span>
                  <span className="flight-detail-value">{new Date(selectedFlightDetails.createdAt).toLocaleString()}</span>
                </div>
                <div className="flight-detail-item">
                  <span className="flight-detail-label">Updated At:</span>
                  <span className="flight-detail-value">{new Date(selectedFlightDetails.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetailsModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
