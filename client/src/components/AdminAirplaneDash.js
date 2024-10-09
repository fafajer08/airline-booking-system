
import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminAirplaneDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [airplanes, setAirplanes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAirplane, setSelectedAirplane] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    planeId: "",
    brand: "",
    model: "",
    airlineName: "",
    totalSeats: "",
    economySeat: "",
    premiumSeat: "",
    businessSeat: "",
    firstClass: "",
    isActive: "",
  });
  const [newAirplane, setNewAirplane] = useState({
    planeId: "",
    brand: "",
    model: "",
    airlineName: "",
    totalSeats: "0",
    economySeat: "0",
    premiumSeat: "0",
    businessSeat: "0",
    firstClass: "0",
    isActive: true
  });

  // Loading states
  const [loadingData, setLoadingData] = useState(true); // For initial data fetching
  const [addingAirplane, setAddingAirplane] = useState(false); // For adding an airplane
  const [togglingAirplaneId, setTogglingAirplaneId] = useState(null); // To track which airplane is being toggled

  useEffect(() => {
    const fetchAirplanes = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/all`);
        if (!response.ok) {
          throw new Error(`Error fetching airplanes: ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setAirplanes(data);
          notyf.success("Airplanes fetched successfully.");
        } else {
          setAirplanes([]);
          notyf.error("No airplanes found.");
        }
      } catch (error) {
        notyf.error('There was a problem fetching airplanes.');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAirplanes();
  }, []);

  // TOGGLE ACTIVE WHEN BUTTON UNDER STATUS IS CLICKED
  const toggleIsActive = async (id, isActive) => {
    setTogglingAirplaneId(id); // Set the ID of the airplane being toggled
    const action = isActive ? 'archive' : 'activate';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setAirplanes((prevAirplanes) =>
          prevAirplanes.map((airplane) =>
            airplane._id === id ? { ...airplane, isActive: !airplane.isActive } : airplane
          )
        );
        notyf.success(`Airplane ${isActive ? 'archived' : 'activated'} successfully.`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} the airplane.`);
      }
    } catch (error) {
      notyf.error(`Error: ${error.message}`);
      console.error(`There was a problem with the ${action} operation:`, error);
    } finally {
      setTogglingAirplaneId(null); // Reset toggling state
    }
  };

  // HANDLE SORTING WHEN TABLE HEADER IS CLICKED
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // HANDLE SORTING
  const getSortedAirplanes = () => {
    const sortedAirplanes = Array.isArray(airplanes) ? [...airplanes] : [];
    if (sortConfig.key) {
      sortedAirplanes.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedAirplanes;
  };

  const filteredAirplanes = getSortedAirplanes().filter((airplane) =>
    Object.keys(columnSearch).every((key) => {
      const airplaneValue = airplane[key];
      const searchValue = columnSearch[key];

      if (searchValue === "") {
        return true; // If search input is empty, return all results
      }

      // Handle string searches (text)
      if (typeof airplaneValue === "string") {
        return airplaneValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      // Handle number searches
      if (typeof airplaneValue === "number") {
        return airplaneValue === Number(searchValue); // Ensure both are numbers for comparison
      }

      // Handle boolean searches
      if (typeof airplaneValue === "boolean") {
        return airplaneValue === (searchValue === "true");
      }

      return true; // Default return for unmatched cases
    })
  );

  const paginatedAirplanes = filteredAirplanes.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredAirplanes.length / rowsPerPage);


  const handleRowClick = (airplane) => {
    setSelectedAirplane(airplane);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  const handleHeaderClick = (key) => {
    handleSort(key);
  };

  const renderTableHeader = (label, key) => (
    <th onClick={() => handleHeaderClick(key)}>
      {label} {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
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

  const handleClearSearch = () => {
    setColumnSearch({
      planeId: "",
      brand: "",
      model: "",
      airlineName: "",
      totalSeats: "",
      economySeat: "",
      premiumSeat: "",
      businessSeat: "",
      firstClass: "",
      isActive: "",
    });
    notyf.success("Search filters cleared.");
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleAddAirplane = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setAddingAirplane(true); // Start adding airplane

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newAirplane), // Send the form data
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add new airplane: ${response.status} ${responseData.message}`);
      }

      setAirplanes((prevAirplanes) => [...prevAirplanes, responseData]);
      setAddModalVisible(false); // Close the modal after adding the airplane
      setNewAirplane({
        planeId: "",
        brand: "",
        model: "",
        airlineName: "",
        totalSeats: "0",
        economySeat: "0",
        premiumSeat: "0",
        businessSeat: "0",
        firstClass: "0",
        isActive: true
      }); // Reset form
      notyf.success('Airplane added successfully.');
    } catch (error) {
      notyf.error(`Error adding airplane: ${error.message}`);
      console.error('There was a problem with adding the airplane:', error);
    } finally {
      setAddingAirplane(false); // Stop adding airplane
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirplane((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  return (
    <div className="dash-container">
      <div className="d-flex justify-content-between mb-3">
        <Button 
          variant="primary" 
          onClick={() => setAddModalVisible(true)}
          disabled={loadingData} // Disable if data is loading
        >
          {loadingData ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> Loading...
            </>
          ) : (
            "Add Airplane"
          )}
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleClearSearch} 
          className="ms-2"
          disabled={loadingData} // Disable if data is loading
        >
          Clear Search
        </Button>
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

      {/* Loading Spinner for Data Fetching */}
      {loadingData ? (
        <div className="d-flex justify-content-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <table>
          <thead>
            {/* Sorting Header Row */}
            <tr>
              {renderTableHeader("AIRPLANE ID", "planeId")}
              {renderTableHeader("MAKER", "brand")}
              {renderTableHeader("MODEL", "model")}
              {renderTableHeader("AIRLINE", "airlineName")}
              {renderTableHeader("SEATS", "totalSeats")}
              {renderTableHeader("FIRST CLASS", "firstClass")}
              {renderTableHeader("BUSINESS", "businessSeat")}
              {renderTableHeader("PREMIUM", "premiumSeat")}
              {renderTableHeader("ECONOMY", "economySeat")}
              {renderTableHeader("STATUS", "isActive")}
            </tr>
            {/* Search Row */}
            <tr>
              {renderTableSearch("planeId", "text")}
              {renderTableSearch("brand", "text")}
              {renderTableSearch("model", "text")}
              {renderTableSearch("airlineName", "text")}
              {renderTableSearch("totalSeats", "number")}
              {renderTableSearch("firstClass", "number")}
              {renderTableSearch("businessSeat", "number")}
              {renderTableSearch("premiumSeat", "number")}
              {renderTableSearch("economySeat", "number")}
              {renderTableSearch("isActive", "boolean")}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paginatedAirplanes) && paginatedAirplanes.length > 0 ? (
              paginatedAirplanes.map((airplane) => (
                <tr key={airplane._id} onClick={() => handleRowClick(airplane)}>
                  <td>{airplane.planeId || 'N/A'}</td>
                  <td>{airplane.brand || 'N/A'}</td>
                  <td>{airplane.model || 'N/A'}</td>
                  <td>{airplane.airlineName || 'N/A'}</td>
                  <td>{airplane.totalSeats || 'N/A'}</td>
                  <td>{airplane.firstClass || 'N/A'}</td>
                  <td>{airplane.businessSeat || 'N/A'}</td>
                  <td>{airplane.premiumSeat || 'N/A'}</td>
                  <td>{airplane.economySeat || 'N/A'}</td>

                  <td>
                    <Button
                     className="action-button"
                      variant={airplane.isActive ? "success" : "danger"}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        toggleIsActive(airplane._id, airplane.isActive);
                      }}
                      disabled={togglingAirplaneId === airplane._id} // Disable if this airplane is being toggled
                    >
                      {togglingAirplaneId === airplane._id ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        airplane.isActive ? "Activated" : "Archived"
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No airplanes available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loadingData && Array.isArray(filteredAirplanes) && filteredAirplanes.length > 0 && (
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

      {/* MODAL FOR DETAILS*/}
      {selectedAirplane && (
        <Modal show={isModalVisible} onHide={handleCloseModal} className="modal-details">
          <Modal.Header closeButton>
            <Modal.Title>Airplane Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-details-body">
            <p><strong>Airplane Id:</strong> {selectedAirplane.planeId || 'N/A'}</p>
            <p><strong>Maker:</strong> {selectedAirplane.brand || 'N/A'}</p>
            <p><strong>Model:</strong> {selectedAirplane.model || 'N/A'}</p>
            <p><strong>Airline:</strong> {selectedAirplane.airlineName || 'N/A'}</p>
            <p><strong>Total Seats:</strong> {selectedAirplane.totalSeats || 'N/A'}</p>
            <p><strong>First Class:</strong> {selectedAirplane.firstClass || 'N/A'}</p>
            <p><strong>Business Class:</strong> {selectedAirplane.businessSeat || 'N/A'}</p>
            <p><strong>Premium Class:</strong> {selectedAirplane.premiumSeat || 'N/A'}</p>
            <p><strong>Economy Class:</strong> {selectedAirplane.economySeat || 'N/A'}</p>
            <p><strong>Status:</strong> {selectedAirplane.isActive ? "Active" : "Archived"}</p>
            <p><strong>Created:</strong> {selectedAirplane.createdAt ? new Date(selectedAirplane.createdAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Last Update:</strong> {selectedAirplane.updatedAt ? new Date(selectedAirplane.updatedAt).toLocaleString() : 'N/A'}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* MODAL FOR ADD AIRPLANE */}
      <Modal show={isAddModalVisible} onHide={handleCloseAddModal} className="modal-add">
        <Modal.Header closeButton>
          <Modal.Title>Add New Airplane</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-add-body">
          <form onSubmit={handleAddAirplane}>
            {/* Airplane ID */}
            <div className="mb-3">
              <label htmlFor="planeId" className="form-label">Airplane ID</label>
              <input
                type="text"
                className="form-control"
                id="planeId"
                name="planeId"
                value={newAirplane.planeId}
                onChange={handleInputChange}
                required
                placeholder="Enter the airplane ID"
              />
            </div>

            {/* Airplane Maker */}
            <div className="mb-3">
              <label htmlFor="brand" className="form-label">Airplane Maker</label>
              <input
                type="text"
                className="form-control"
                id="brand"
                name="brand"
                value={newAirplane.brand}
                onChange={handleInputChange}
                required
                placeholder="Enter airplane brand"
              />
            </div>

            {/* Airplane Model */}
            <div className="mb-3">
              <label htmlFor="model" className="form-label">Airplane Model</label>
              <input
                type="text"
                className="form-control"
                id="model"
                name="model"
                value={newAirplane.model}
                onChange={handleInputChange}
                required
                placeholder="Enter airplane model"
              />
            </div>

            {/* Airline Name */}
            <div className="mb-3">
              <label htmlFor="airlineName" className="form-label">Airline Name</label>
              <input
                type="text"
                className="form-control"
                id="airlineName"
                name="airlineName"
                value={newAirplane.airlineName}
                onChange={handleInputChange}
                required
                placeholder="Enter airline name"
              />
            </div>

            {/* Total Seats */}
            <div className="mb-3">
              <label htmlFor="totalSeats" className="form-label">Total Seats</label>
              <input
                type="number"
                className="form-control"
                id="totalSeats"
                name="totalSeats"
                value={newAirplane.totalSeats}
                onChange={handleInputChange}
                required
                placeholder="Enter total seats"
                min="0"
              />
            </div>

            {/* First Class Seats */}
            <div className="mb-3">
              <label htmlFor="firstClass" className="form-label">First Class Seats</label>
              <input
                type="number"
                className="form-control"
                id="firstClass"
                name="firstClass"
                value={newAirplane.firstClass}
                onChange={handleInputChange}
                required
                placeholder="Enter first class seats"
                min="0"
              />
            </div>

            {/* Business Class Seats */}
            <div className="mb-3">
              <label htmlFor="businessSeat" className="form-label">Business Class Seats</label>
              <input
                type="number"
                className="form-control"
                id="businessSeat"
                name="businessSeat"
                value={newAirplane.businessSeat}
                onChange={handleInputChange}
                required
                placeholder="Enter business class seats"
                min="0"
              />
            </div>

            {/* Premium Seats */}
            <div className="mb-3">
              <label htmlFor="premiumSeat" className="form-label">Premium Seats</label>
              <input
                type="number"
                className="form-control"
                id="premiumSeat"
                name="premiumSeat"
                value={newAirplane.premiumSeat}
                onChange={handleInputChange}
                required
                placeholder="Enter premium seats"
                min="0"
              />
            </div>

            {/* Economy Seats */}
            <div className="mb-3">
              <label htmlFor="economySeat" className="form-label">Economy Seats</label>
              <input
                type="number"
                className="form-control"
                id="economySeat"
                name="economySeat"
                value={newAirplane.economySeat}
                onChange={handleInputChange}
                required
                placeholder="Enter economy seats"
                min="0"
              />
            </div>

            {/* Status (isActive) */}
            <div className="mb-3">
              <label htmlFor="isActive" className="form-label">Status</label>
              <select
                className="form-select"
                id="isActive"
                name="isActive"
                value={newAirplane.isActive ? "true" : "false"}
                onChange={(e) => setNewAirplane({ ...newAirplane, isActive: e.target.value === "true" })}
                required
              >
                <option value="true">Activated</option>
                <option value="false">Archived</option>
              </select>
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={addingAirplane}>
                {addingAirplane ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> Adding...
                  </>
                ) : (
                  "Add Airplane"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
