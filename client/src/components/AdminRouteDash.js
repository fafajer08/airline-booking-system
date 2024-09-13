import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/adminairportdash.css';

export default function AdminRouteDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [routes, setRoutes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    departure: "",
    destination: "",
    distanceKM: "",
    durationMins: ""
  });

  // For adding a new route
  const [newRoute, setNewRoute] = useState({
    departure: "",
    destination: "",
    distanceKM: "",
    durationMins: ""
  });

  // Fetch routes and airports from backend
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/routes/all`);
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    const fetchAirports = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/airports/all`);
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };

    fetchRoutes();
    fetchAirports();
  }, []);

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted routes based on the selected sort key
  const getSortedRoutes = () => {
    const sortedRoutes = [...routes];
    if (sortConfig.key) {
      sortedRoutes.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedRoutes;
  };

  const filteredRoutes = getSortedRoutes().filter((route) =>
    Object.keys(columnSearch).every((key) => {
      const routeValue = key.includes('.') 
        ? key.split('.').reduce((acc, part) => acc[part], route) // handle nested keys
        : route[key];
      const searchValue = columnSearch[key];

      if (searchValue === "") {
        return true; // If search input is empty, return all results
      }

      if (typeof routeValue === "string") {
        return routeValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (typeof routeValue === "number") {
        return routeValue === Number(searchValue);
      }

      return true;
    })
  );

  const paginatedRoutes = filteredRoutes.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredRoutes.length / rowsPerPage);

  const handleRowClick = (route) => {
    setSelectedRoute(route);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  const handleHeaderClick = (key) => {
    handleSort(key);
  };

  const renderTableHeader = (label, key) => (
    <th onClick={() => handleHeaderClick(key)}>
      {label}
    </th>
  );

  const renderTableSearch = (key, type) => (
    <td>
      {type === 'number' ? (
        <input
          type="number"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder={`Search ${key}`}
          className="table-search-input"
        />
      ) : (
        <input
          type="text"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder={`Search ${key}`}
          className="table-search-input"
        />
      )}
    </td>
  );

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleAddRoute = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/routes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newRoute),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add new route: ${response.status} ${responseData.message}`);
      }

      setRoutes((prevRoutes) => [...prevRoutes, responseData]);
      setAddModalVisible(false); // Close the modal after adding the route
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setAddModalVisible(true)}>Add Route</Button>
        <Button variant="secondary" onClick={() => setColumnSearch({
          departure: "",
          destination: "",
          distanceKM: "",
          durationMins: ""
        })} className="ms-2">Clear Search</Button>
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
            {renderTableHeader("DEPARTURE", "departure")}
            {renderTableHeader("DESTINATION", "destination")}
            {renderTableHeader("DISTANCE (KM)", "distanceKM")}
            {renderTableHeader("DURATION (MINS)", "durationMins")}
          </tr>
          <tr>
            {renderTableSearch("departure", "text")}
            {renderTableSearch("destination", "text")}
            {renderTableSearch("distanceKM", "number")}
            {renderTableSearch("durationMins", "number")}
          </tr>
        </thead>
        <tbody>
          {paginatedRoutes.length > 0 ? (
            paginatedRoutes.map((route) => (
              <tr key={route._id} onClick={() => handleRowClick(route)}>
                <td>{route.departure.airportName}</td>
                <td>{route.destination.airportName}</td>
                <td>{route.distanceKM}</td>
                <td>{route.durationMins}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No routes available</td>
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

      {/* Modals */}
      {selectedRoute && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Route Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Departure:</strong> {selectedRoute.departure.airportName}</p>
            <p><strong>Destination:</strong> {selectedRoute.destination.airportName}</p>
            <p><strong>Distance (KM):</strong> {selectedRoute.distanceKM}</p>
            <p><strong>Duration (Mins):</strong> {selectedRoute.durationMins}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={isAddModalVisible} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Route</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddRoute}>
            <div className="mb-3">
              <label htmlFor="departure" className="form-label">Departure Airport</label>
              <select
                className="form-select"
                id="departure"
                name="departure"
                value={newRoute.departure}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Departure Airport</option>
                {airports.map((airport) => (
                  <option key={airport._id} value={airport._id}>
                    {airport.airportName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="destination" className="form-label">Destination Airport</label>
              <select
                className="form-select"
                id="destination"
                name="destination"
                value={newRoute.destination}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Destination Airport</option>
                {airports.map((airport) => (
                  <option key={airport._id} value={airport._id}>
                    {airport.airportName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="distanceKM" className="form-label">Distance (KM)</label>
              <input
                type="number"
                className="form-control"
                id="distanceKM"
                name="distanceKM"
                value={newRoute.distanceKM}
                onChange={handleInputChange}
                required
                placeholder="Enter distance in kilometers"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="durationMins" className="form-label">Duration (Mins)</label>
              <input
                type="number"
                className="form-control"
                id="durationMins"
                name="durationMins"
                value={newRoute.durationMins}
                onChange={handleInputChange}
                required
                placeholder="Enter duration in minutes"
              />
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Add Route
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
