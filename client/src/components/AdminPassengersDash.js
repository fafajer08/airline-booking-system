import React, { useState, useEffect } from "react";
import ModalPrompt from "./ModalPrompt";
import '../styles/adminflightsdash.css';  // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import mockFlights from '../data/flightsData';

export default function AdminPassengersDash() {
  const [flights, setFlights] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false); 
  const [fieldsConfig, setFieldsConfig] = useState([]);
  const [apiDetails, setApiDetails] = useState({ apiUrl: "", method: "POST", needsAuth: true });
  const [filteringColumn, setFilteringColumn] = useState(null);
  const [filters, setFilters] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const apiBaseUrl = "/api/flights";

  useEffect(() => {
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

  // Filter the flights based on search query and column-specific filters
  const filteredFlights = sortedFlights.filter((flight) => {
    return Object.keys(filters).every((key) =>
      flight[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastFlight = currentPage * itemsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - itemsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);  // Reset to the first page
  };

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

  const handleAddFlight = () => {
    setApiDetails({ apiUrl: apiBaseUrl, method: "POST", needsAuth: true });
  
    setFieldsConfig([
      // Your fieldsConfig for adding a flight
    ]);
  
    setModalVisible(true);  // Open the modal
  };
  
  const handleEditFlight = (flight) => {
    setApiDetails({
      apiUrl: `${apiBaseUrl}/${flight.flightNumber}`,
      method: "PUT",
      needsAuth: true,
    });

    setFieldsConfig([
      // Your fieldsConfig for editing a flight
    ]);

    setModalVisible(true);
  };

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

  const handleHeaderClick = (key) => {
    handleSort(key);
    setFilteringColumn(key);
  };

  const handleFilterChange = (e, column) => {
    setFilters({ ...filters, [column]: e.target.value });
  };

  return (
    <div>
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by flight number, airport, or status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" onClick={handleAddFlight}>
          Add Flight
        </button>
      </div>

      {/* Items per page selection */}
      <div>
        <label htmlFor="itemsPerPage">Flights per page: </label>
        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Table of flights */}
      <table>
        <thead>
          <tr>
            {["departureDate", "departureAirport", "destinationAirport", "departureTime", "flightNumber", "seats", "booked"].map((key) => (
              <th key={key} onClick={() => handleHeaderClick(key)}>
                {key.toUpperCase()}
                <span>
                  {sortConfig.key === key && sortConfig.direction === "ascending" && <FontAwesomeIcon icon={faSortUp} />}
                  {sortConfig.key === key && sortConfig.direction === "descending" && <FontAwesomeIcon icon={faSortDown} />}
                </span>
                {filteringColumn === key && (
                  <input
                    type="text"
                    placeholder={`Filter ${key}`}
                    onChange={(e) => handleFilterChange(e, key)}
                    style={{ display: 'block', width: '100%' }}
                  />
                )}
              </th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {currentFlights.length > 0 ? (
            currentFlights.map((flight, index) => (
              <tr key={index} className={getRowClass(flight.actionStatus)}>
                <td>{flight.departureDate}</td>
                <td>{flight.departureAirport.code}</td>
                <td>{flight.destinationAirport.code}</td>
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

      {/* Pagination Controls */}
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)} disabled={index + 1 === currentPage}>
            {index + 1}
          </button>
        ))}
      </div>

      <ModalPrompt
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        apiUrl={apiDetails.apiUrl}
        method={apiDetails.method}
        needsAuth={apiDetails.needsAuth}
        fieldsConfig={fieldsConfig}
      />
    </div>
  );
}
