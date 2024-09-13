
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../styles/adminairplanedash.css';
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
    totalSeats: "0",
    economySeat: "0",
    premiumSeat: "0",
    businessSeat: "0",
    firstClass: "0",
    isActive: false
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

  useEffect(() => {
    //FETCH DATA FROM API
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

  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate';

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/${action}/${id}`, {
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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

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
      if (airplaneValue && typeof airplaneValue === "string") {
        return airplaneValue.toLowerCase().includes(columnSearch[key].toLowerCase());
      }
      return true;
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
      <input
        type="text"
        value={columnSearch[key] || ""}
        onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
        placeholder={`Search ${label}`}
        className="table-search-input"
      />
    </th>
  );

  const handleAddAirplane = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      console.log('Sending new airplane data:', newAirplane); // Log the form data

      const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newAirplane), // Send the form data
      });

      const responseData = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

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

  const handleCloseAddModal = () => setAddModalVisible(false);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setAddModalVisible(true)}>Add Airplane</Button>
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
            {renderTableHeader("AIRPLANE ID", "planeId")}
            {renderTableHeader("MAKER", "brand")}
            {renderTableHeader("MODEL", "model")}
            {renderTableHeader("AIRLINE", "airlineName")}
            {renderTableHeader("TOTAL SEATS", "totalSeats")}
            {renderTableHeader("FIRSTCLASS", "firstClass")}
            {renderTableHeader("BUSINESS", "businessSeat")}
            {renderTableHeader("PREMIUM", "premiumSeat")}
            {renderTableHeader("ECONOMY", "economySeat")}
            {renderTableHeader("ECONOMY", "isActive")}
            
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
              <td colSpan="5">No airplanes available</td>
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

      {selectedAirplane && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Airplane Details - {selectedAirplane.airplaneName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {selectedAirplane.airplaneName}</p>
            <p><strong>Code:</strong> {selectedAirplane.airplaneCode}</p>
            <p><strong>City:</strong> {selectedAirplane.airplaneCity}</p>
            <p><strong>Country:</strong> {selectedAirplane.airplaneCountry}</p>
            <p><strong>Status:</strong> {selectedAirplane.isActive ? "Active" : "Archived"}</p>
            <p><strong>Created:</strong> {selectedAirplane.createdAt.date}</p>
            <p><strong>Last Update:</strong> {selectedAirplane.updatedAt.date}</p>

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
          <Modal.Title>Add New Airplane</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddAirplane}> {/* Fix the form submission */}
            <div className="mb-3">
              <label htmlFor="airplaneName" className="form-label">Airplane Name</label>
              <input
                type="text"
                className="form-control"
                id="airplaneName"
                name="airplaneName"
                value={newAirplane.airplaneName}
                onChange={handleInputChange}
                required
                placeholder="Enter the airplane name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="airplaneCode" className="form-label">Airplane Code</label>
              <input
                type="text"
                className="form-control"
                id="airplaneCode"
                name="airplaneCode"
                value={newAirplane.airplaneCode}
                onChange={handleInputChange}
                required
                placeholder="Enter the 3-digit airplane code"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="airplaneCity" className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                id="airplaneCity"
                name="airplaneCity"
                value={newAirplane.airplaneCity}
                onChange={handleInputChange}
                required
                placeholder="Enter city name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="airplaneCountry" className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                id="airplaneCountry"
                name="airplaneCountry"
                value={newAirplane.airplaneCountry}
                onChange={handleInputChange}
                required
                placeholder="Enter country name"
              />
            </div>

            <Modal.Footer>
              <Button variant="warning" onClick={handleCloseAddModal}>
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

