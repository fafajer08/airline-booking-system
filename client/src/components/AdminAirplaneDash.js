import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from "react";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminAirplaneDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [airplanes, setAirplanes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
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
      isActive: "" // Reset to empty string, clearing the search
    });
  };
  

  // FETCH DATA - GET ALL AIRPLANES
  useEffect(() => {
    const fetchAirplanes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/all`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAirplanes(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchAirplanes();
  }, []);

  // TOGGLE ACTIVE WHEN BUTTON UNDER STATUSIS CLICKED
  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      setAirplanes((prevAirplanes) =>
        prevAirplanes.map((airplane) =>
          airplane._id === id ? { ...airplane, isActive: !airplane.isActive } : airplane
        )
      );
    } catch (error) {
      console.error(`There was a problem with the ${action} operation:`, error);
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

  //HANDLE SORTING
  const getSortedAirplanes = () => {
    const sortedAirplanes = [...airplanes];
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

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleAddAirplane = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
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
    } catch (error) {
      console.error('There was a problem with adding the airplane:', error);
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
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setAddModalVisible(true)}>Add Airplane</Button>
        <Button variant="secondary" onClick={handleClearSearch} className="ms-2">Clear Search</Button>
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
          {paginatedAirplanes.length > 0 ? (
            paginatedAirplanes.map((airplane) => (
              <tr key={airplane._id} onClick={() => handleRowClick(airplane)}>
                <td>{airplane.planeId}</td>
                <td>{airplane.brand}</td>
                <td>{airplane.model}</td>
                <td>{airplane.airlineName}</td>
                <td>{airplane.totalSeats}</td>
                <td>{airplane.firstClass}</td>
                <td>{airplane.businessSeat}</td>
                <td>{airplane.premiumSeat}</td>
                <td>{airplane.economySeat}</td>

                <td>
                  <Button
                    variant={airplane.isActive ? "success" : "danger"}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      toggleIsActive(airplane._id, airplane.isActive);
                    }}
                  >
                    {airplane.isActive ? "Activated" : "Archived"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No airplanes available</td>
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

      {/* MODAL FOR DETAILS*/}
      {selectedAirplane && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Airplane Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Airplane Id:</strong> {selectedAirplane.planeId}</p>
            <p><strong>Maker:</strong> {selectedAirplane.brand}</p>
            <p><strong>Model:</strong> {selectedAirplane.model}</p>
            <p><strong>Airline:</strong> {selectedAirplane.airlineName}</p>
            <p><strong>Total Seats:</strong> {selectedAirplane.totalSeats}</p>
            <p><strong>First Class:</strong> {selectedAirplane.firstClass}</p>
            <p><strong>Business Class:</strong> {selectedAirplane.businessSeat}</p>
            <p><strong>Premium Class:</strong> {selectedAirplane.premiumSeat}</p>
            <p><strong>Economy Class:</strong> {selectedAirplane.economyCkass}</p>
            <p><strong>Status:</strong> {selectedAirplane.isActive ? "Active" : "Archived"}</p>
            <p><strong>Created:</strong> {selectedAirplane.createdAt}</p>
            <p><strong>Last Update:</strong> {selectedAirplane.updatedAt}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* MODAL FOR ADD AIRPLANE */}
      <Modal show={isAddModalVisible} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Airplane</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                onChange={handleInputChange}
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
              <Button type="submit" variant="primary">
                Add Airplane
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

    </div>
  );
}
