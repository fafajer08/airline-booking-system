import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


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
    durationMins: "",
    isActive: ""
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
    const sortedRoutes = Array.isArray(routes) ? [...routes] : []; 
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
      ) : type === 'boolean' ? (
        <select
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          className="table-search-input"
        >
          <option value="">All</option>
          <option value="true">Activated</option>
          <option value="false">Archived</option>
        </select>
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

  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate';
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/routes/${action}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        setRoutes((prevRoutes) => {
          if (Array.isArray(prevRoutes)) {
            return prevRoutes.map((route) =>
              route._id === id ? { ...route, isActive: !route.isActive } : route
            );
          } else {
            return []; // Return an empty array if prevRoutes is not an array
          }
        });
        notyf.success(`Route ${isActive ? 'archived' : 'activated'} successfully.`);
      } else {
        notyf.error(`Failed to ${isActive ? 'archive' : 'activate'} the route.`);
      }
    } catch (error) {
      console.error('Error updating route status:', error);
      notyf.error('Error updating route status.');
    }
  };



  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleAddRoute = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (newRoute.departure === newRoute.destination) {
      notyf.error('Departure and destination airports cannot be the same.');
      return;
    }

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

      setRoutes((prevRoutes) => (Array.isArray(prevRoutes) ? [...prevRoutes, responseData] : [responseData]));
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
    <div className="dash-container">
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setAddModalVisible(true)}>Add Route</Button>
        <Button variant="secondary" onClick={() => setColumnSearch({
          departure: "",
          destination: "",
          distanceKM: "",
          durationMins: "",
          isActive: ""
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
            {renderTableHeader("DEPARTURE CITY", "departure.airportCity")} 
            {renderTableHeader("DEPARTURE", "departure.airportName")}
            {renderTableHeader("DESTINATION CITY", "destination.airportCity")}
            {renderTableHeader("DESTINATION", "destination.airportName")}
            {renderTableHeader("DISTANCE (KM)", "distanceKM")}
            {renderTableHeader("DURATION (MINS)", "durationMins")}
            {renderTableHeader("STATUS", "isActive")}
          </tr>
          <tr>
            {renderTableSearch("departure.airportCity", "text")}
            {renderTableSearch("departure.airportName", "text")}
            {renderTableSearch("destination.airportCity", "text")}
            {renderTableSearch("destination.airportName", "text")}
            {renderTableSearch("distanceKM", "number")}
            {renderTableSearch("durationMins", "number")}
            {renderTableSearch("isActive", "boolean")}
          </tr>
        </thead>
        <tbody>
          {paginatedRoutes && paginatedRoutes.length > 0 ? (
            paginatedRoutes.map((route) => (
              <tr key={route._id} onClick={() => handleRowClick(route)}>
                <td>{route?.departure?.airportCity || 'N/A'}</td>
                <td>{route?.departure?.airportName || 'N/A'}</td>
                <td>{route?.destination?.airportCity || 'N/A'}</td>
                <td>{route?.destination?.airportName || 'N/A'}</td>
                <td>{route?.distanceKM ?? 'N/A'}</td>
                <td>{route?.durationMins ?? 'N/A'}</td>
                <td>
                  <Button
                  className="action-button"
                    variant={route?.isActive ? "success" : "danger"}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      toggleIsActive(route?._id, route?.isActive);
                    }}
                  >
                    {route?.isActive ? "Activated" : "Archived"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No routes available</td>
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

      {/* MODAL FOR DETAILS */}
      {selectedRoute && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Route Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-details-body">
            <p><strong>Departure City:</strong> {selectedRoute.departure.airportCity}</p>
            <p><strong>Departure:</strong> {selectedRoute.departure.airportName}</p>
            <p><strong>Destination City:</strong> {selectedRoute.destination.airportCity}</p>
            <p><strong>Destination:</strong> {selectedRoute.destination.airportName}</p>
            <p><strong>Distance (KM):</strong> {selectedRoute.distanceKM}</p>
            <p><strong>Duration (Mins):</strong> {selectedRoute.durationMins}</p>
            <p><strong>Created:</strong> {selectedRoute.createdAt}</p>
            <p><strong>Last Update:</strong> {selectedRoute.updatedAt}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}


      {/* MODAL FOR ADDING ROUTES */}
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
                {airports
                  .sort((a, b) => a.airportCity.localeCompare(b.airportCity)) // Sort airports by airportCity
                  .map((airport) => (
                    <option key={airport._id} value={airport._id}>
                      {airport.airportCity} - {airport.airportName}
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
                disabled={!newRoute.departure} // Disable until departure is selected
              >
                <option value="">Select Destination Airport</option>
                {airports
                  .filter(airport => airport._id !== newRoute.departure)
                  .sort((a, b) => a.airportCity.localeCompare(b.airportCity)) 
                  .map((airport) => (
                    <option key={airport._id} value={airport._id}>
                    {airport.airportCity} - {airport.airportName}
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

