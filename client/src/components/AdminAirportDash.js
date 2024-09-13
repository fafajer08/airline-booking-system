
import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/adminairportdash.css';

export default function AdminAirportDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [airports, setAirports] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    airportName: "",
    airportCode: "",
    airportCity: "",
    airportCountry: "",
    isActive: "",
  });
  const [newAirport, setNewAirport] = useState({
    airportName: "",
    airportCode: "",
    airportCity: "",
    airportCountry: "",
    isActive: true
  });

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/airports/all`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchAirports();
  }, []);

  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/airports/${action}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.message);
      }

      setAirports((prevAirports) =>
        prevAirports.map((airport) =>
          airport._id === id ? { ...airport, isActive: !airport.isActive } : airport
        )
      );
    } catch (error) {
      console.error(`There was a problem with the ${action} operation:`, error);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedAirports = () => {
    const sortedAirports = [...airports];
    if (sortConfig.key) {
      sortedAirports.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedAirports;
  };

  const filteredAirports = getSortedAirports().filter((airport) =>
    Object.keys(columnSearch).every((key) => {
      const airportValue = airport[key];
      const searchValue = columnSearch[key];
  
      if (searchValue === "") {
        return true; // If search input is empty, return all results
      }
  
      // Handle string searches (text)
      if (typeof airportValue === "string") {
        return airportValue.toLowerCase().includes(searchValue.toLowerCase());
      }
  
      // Handle boolean searches
      if (typeof airportValue === "boolean") {
        return airportValue === (searchValue === "true");
      }
  
      return true; // Default return for unmatched cases
    })
  );
  
  const paginatedAirports = filteredAirports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredAirports.length / rowsPerPage);

  const handleRowClick = (airport) => {
    setSelectedAirport(airport);
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
      {type === 'boolean' ? (
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

  const handleAddAirport = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/airports/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newAirport), // Send the form data
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add new airport: ${response.status} ${responseData.message}`);
      }
  
      setAirports((prevAirports) => [...prevAirports, responseData]);
      setAddModalVisible(false); // Close the modal after adding the airport
    } catch (error) {
      console.error('There was a problem with adding the airport:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirport((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setAddModalVisible(true)}>Add Airport</Button>
        <Button variant="secondary" onClick={() => setColumnSearch({
          airportName: "",
          airportCode: "",
          airportCity: "",
          airportCountry: "",
          isActive: "",
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
          {/* Sorting Header Row */}
          <tr>
            {renderTableHeader("AIRPORT NAME", "airportName")}
            {renderTableHeader("AIRPORT CODE", "airportCode")}
            {renderTableHeader("CITY", "airportCity")}
            {renderTableHeader("COUNTRY", "airportCountry")}
            {renderTableHeader("STATUS", "isActive")}
          </tr>
          {/* Search Row */}
          <tr>
            {renderTableSearch("airportName", "text")}
            {renderTableSearch("airportCode", "text")}
            {renderTableSearch("airportCity", "text")}
            {renderTableSearch("airportCountry", "text")}
            {renderTableSearch("isActive", "boolean")}
          </tr>
        </thead>
        <tbody>
          {paginatedAirports.length > 0 ? (
            paginatedAirports.map((airport) => (
              <tr key={airport._id} onClick={() => handleRowClick(airport)}>
                <td>{airport.airportName}</td>
                <td>{airport.airportCode}</td>
                <td>{airport.airportCity}</td>
                <td>{airport.airportCountry}</td>
                <td>
                  <Button
                    variant={airport.isActive ? "success" : "danger"}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      toggleIsActive(airport._id, airport.isActive);
                    }}
                  >
                    {airport.isActive ? "Activated" : "Archived"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No airports available</td>
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
      {selectedAirport && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Airport Details - {selectedAirport.airportName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Code:</strong> {selectedAirport.airportCode}</p>
            <p><strong>City:</strong> {selectedAirport.airportCity}</p>
            <p><strong>Country:</strong> {selectedAirport.airportCountry}</p>
            <p><strong>Status:</strong> {selectedAirport.isActive ? "Active" : "Archived"}</p>
            <p><strong>Created:</strong> {selectedAirport.createdAt.date}</p>
            <p><strong>Last Update:</strong> {selectedAirport.updatedAt.date}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Add Airport Modal */}
      <Modal show={isAddModalVisible} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Airport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddAirport}>
            {/* Airport Name */}
            <div className="mb-3">
              <label htmlFor="airportName" className="form-label">Airport Name</label>
              <input
                type="text"
                className="form-control"
                id="airportName"
                name="airportName"
                value={newAirport.airportName}
                onChange={handleInputChange}
                required
                placeholder="Enter airport name"
              />
            </div>

            {/* Airport Code */}
            <div className="mb-3">
              <label htmlFor="airportCode" className="form-label">Airport Code (3 letters)</label>
              <input
                type="text"
                className="form-control"
                id="airportCode"
                name="airportCode"
                value={newAirport.airportCode}
                onChange={handleInputChange}
                required
                minLength={3}
                maxLength={3}
                placeholder="Enter airport code"
              />
            </div>

            {/* City */}
            <div className="mb-3">
              <label htmlFor="airportCity" className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                id="airportCity"
                name="airportCity"
                value={newAirport.airportCity}
                onChange={handleInputChange}
                required
                placeholder="Enter city"
              />
            </div>

            {/* Country */}
            <div className="mb-3">
              <label htmlFor="airportCountry" className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                id="airportCountry"
                name="airportCountry"
                value={newAirport.airportCountry}
                onChange={handleInputChange}
                required
                placeholder="Enter country"
              />
            </div>

            {/* Status */}
            <div className="mb-3">
              <label htmlFor="isActive" className="form-label">Status</label>
              <select
                className="form-select"
                id="isActive"
                name="isActive"
                value={newAirport.isActive ? "true" : "false"}
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
                Add Airport
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
