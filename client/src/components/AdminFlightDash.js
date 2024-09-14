import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/adminflightdash.css';

export default function AdminFlightDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [flights, setFlights] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    flightNo: "",
    airplane: "",
    route: "",
    day: "",
    time: "",
    isActive: ""
  });

  // For adding a new flight
  const [newFlight, setNewFlight] = useState({
    flightNo: "",
    airplane: "",
    route: "",
    day: "",
    time: "",
    isActive: true
  });

  // Fetch flights, airplanes, and routes from backend
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        console.log("Fetching flights...");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/all`);
        const data = await response.json();
        console.log("Fetched flights:", data);
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    const fetchAirplanes = async () => {
      try {
        console.log("Fetching airplanes...");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/airplanes/all`);
        const data = await response.json();
        console.log("Fetched airplanes:", data);
        setAirplanes(data);
      } catch (error) {
        console.error('Error fetching airplanes:', error);
      }
    };

    const fetchRoutes = async () => {
      try {
        console.log("Fetching routes...");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/routes/all`);
        const data = await response.json();
        console.log("Fetched routes:", data);
        setRoutes(data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchFlights();
    fetchAirplanes();
    fetchRoutes();
  }, []);

  // Function to toggle flight activation
  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate';
    console.log(`Toggling flight status: ${action}, ID: ${id}`);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/${action}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        console.log(`Flight ${action}d successfully.`);
        setFlights((prevFlights) => 
          prevFlights.map((flight) => 
            flight._id === id ? { ...flight, isActive: !flight.isActive } : flight
          )
        );
        notyf.success(`Flight ${isActive ? 'archived' : 'activated'} successfully.`);
      } else {
        console.error(`Failed to ${action} the flight.`);
        notyf.error(`Failed to ${isActive ? 'archive' : 'activate'} the flight.`);
      }
    } catch (error) {
      console.error('Error updating flight status:', error);
      notyf.error('Error updating flight status.');
    }
  };

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    console.log(`Sorting by ${key}, direction: ${direction}`);
    setSortConfig({ key, direction });
  };

  // Get sorted flights based on the selected sort key
  const getSortedFlights = () => {
    console.log("Sorting flights with config:", sortConfig);
    const sortedFlights = [...flights];
    if (sortConfig.key) {
      sortedFlights.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedFlights;
  };

  const filteredFlights = getSortedFlights().filter((flight) =>
    Object.keys(columnSearch).every((key) => {
      const flightValue = key.includes('.') 
        ? key.split('.').reduce((acc, part) => acc[part], flight) // handle nested keys
        : flight[key];
      const searchValue = columnSearch[key];

      if (searchValue === "") {
        return true; // If search input is empty, return all results
      }

      if (typeof flightValue === "string") {
        return flightValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (typeof flightValue === "number") {
        return flightValue === Number(searchValue);
      }

      return true;
    })
  );

  const paginatedFlights = filteredFlights.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredFlights.length / rowsPerPage);

  const handleRowClick = (flight) => {
    console.log("Row clicked:", flight);
    console.log("Departure airport:", flight?.route?.departure?.airportCity);
    console.log("Destination airport:", flight?.route?.destination?.airportCity);
    setSelectedFlight(flight);
    setModalVisible(true);
  };
  

  const handleCloseModal = () => {
    console.log("Closing modal...");
    setModalVisible(false);
  };

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
    console.log("Closing add modal...");
    setAddModalVisible(false);
  };

  const handleAddFlight = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Adding flight:", newFlight);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newFlight),
      });

      const responseData = await response.json();
      console.log("Flight added:", responseData);
      if (!response.ok) {
        throw new Error(`Failed to add new flight: ${response.status} ${responseData.message}`);
      }
      
      setFlights((prevFlights) => [...prevFlights, responseData]);
      setAddModalVisible(false); // Close the modal after adding the flight
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change - ${name}: ${value}`);
    setNewFlight((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const mapDayToWeekday = (day) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day - 1];
  };

  return (
    <div>
    <div className="d-flex justify-content-between mb-3">
    <Button variant="primary" onClick={() => setAddModalVisible(true)}>Add Flight</Button>
    <Button variant="secondary" onClick={() => setColumnSearch({
        flightNo: "",
        airplane: "",
        route: "",
        day: "",
        time: "",
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
        {renderTableHeader("Flight No", "flightNo")}
        {renderTableHeader("Airplane Id", "airplane")}
        {renderTableHeader("Departure City", "departureCity")}
        {renderTableHeader("Departure Airport", "departureAirport")}
        {renderTableHeader("Destination City", "destinationCity")}
        {renderTableHeader("Destination Airport", "destinationAirport")}
        {renderTableHeader("Total Seats", "totalSeats")}
        {renderTableHeader("Day", "day")}
        {renderTableHeader("Time", "time")}
        {renderTableHeader("Status", "isActive")}
        </tr>
        <tr>
        {renderTableSearch("flightNo", "text")}
        {renderTableSearch("airplane", "text")}
        {renderTableSearch("epartureCity", "text")}
        {renderTableSearch("departureAirport", "text")}
        {renderTableSearch("destinationCity", "text")}
        {renderTableSearch("destinationAirport", "text")}
        {renderTableSearch("totalSeats", "number")}
        {renderTableSearch("day", "number")}
        {renderTableSearch("time", "text")}
        {renderTableSearch("isActive", "boolean")}
        </tr>
    </thead>

        <tbody>
        {paginatedFlights.length > 0 ? (
            paginatedFlights.map((flight) => (
            <tr key={flight._id} onClick={() => handleRowClick(flight)}>
                <td>{flight.flightNo}</td>
                <td>{flight?.airplane?.planeId || "N/A"}</td>
                <td>{flight?.route?.departure?.airportCity || "N/A"} - {flight?.route?.departure?.airportCode || "N/A"}</td>
                <td>{flight?.route?.departure?.airportName || "N/A"}</td>
                <td>{flight?.route?.destination?.airportCity || "N/A"} - {flight?.route?.destination?.airportCode || "N/A"}</td>
                <td>{flight?.route?.destination?.airportName || "N/A"}</td>
                <td>{flight?.airplane?.totalSeats || "N/A"}</td>
                <td>{mapDayToWeekday(flight.day)}</td>
                <td>{flight.time}</td>
                <td>
                <Button
                    variant={flight.isActive ? "success" : "danger"}
                    onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    toggleIsActive(flight._id, flight.isActive);
                    }}
                >
                    {flight.isActive ? "Activated" : "Archived"}
                </Button>
                </td>
            </tr>
            ))
        ) : (
            <tr>
            <td colSpan="10">No flights available</td>
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
    {selectedFlight && (
    <Modal show={isModalVisible} onHide={handleCloseModal}>
        <Modal.Header closeButton>
        <Modal.Title>Flight Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p><strong>Flight No:</strong> {selectedFlight.flightNo}</p>
        <p><strong>Airplane Id:</strong> {selectedFlight.airplane.planeId}</p>
        <p><strong>Airplane Brand:</strong> {selectedFlight.airplane.brand}</p>
        <p><strong>Airplane Model:</strong> {selectedFlight.airplane.model}</p>
        <p><strong>Departure City:</strong> {selectedFlight.route.departure.airportCity} - {selectedFlight.route.departure.airportCode}</p>
        <p><strong>Departure Airport:</strong> {selectedFlight.route.departure.airportName}</p>
        <p><strong>Destination City:</strong> {selectedFlight.route.destination.airportCity} - {selectedFlight.route.destination.airportCode}</p>
        <p><strong>Destination Airport:</strong> {selectedFlight.route.destination.airportName}</p>
        <p><strong>Total Seats:</strong> {selectedFlight.airplane.totalSeats}</p>
        <p><strong>First Class:</strong> {selectedFlight.airplane.firstClass}</p>
        <p><strong>Business Class:</strong> {selectedFlight.airplane.businessSeat}</p>
        <p><strong>Premium Class:</strong> {selectedFlight.airplane.premiumSeat}</p>
        <p><strong>Economy Class:</strong> {selectedFlight.airplane.economySeat}</p>
        <p><strong>Every:</strong> {mapDayToWeekday(selectedFlight.day)}</p>
        <p><strong>Time:</strong> {selectedFlight.time}</p>
        <p><strong>Flight Duration (minutes):</strong> {selectedFlight.route.durationMins}</p>
        <p><strong>Status:</strong> {selectedFlight.isActive ? "Activated" : "Archived"}</p>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
            Close
        </Button>
        </Modal.Footer>
    </Modal>
    )}

    {/* Modal for Adding Flights */}
    <Modal show={isAddModalVisible} onHide={handleCloseAddModal}>
    <Modal.Header closeButton>
        <Modal.Title>Add New Flight</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <form onSubmit={handleAddFlight}>
        <div className="mb-3">
            <label htmlFor="flightNo" className="form-label">Flight No</label>
            <input
            type="text"
            className="form-control"
            id="flightNo"
            name="flightNo"
            value={newFlight.flightNo}
            onChange={handleInputChange}
            required
            placeholder="Enter flight number"
            />
        </div>

        <div className="mb-3">
            <label htmlFor="airplane" className="form-label">Airplane</label>
            <select
            className="form-select"
            id="airplane"
            name="airplane"
            value={newFlight.airplane}
            onChange={handleInputChange}
            required
            >
            <option value="">Select Airplane</option>
            {airplanes
                .sort((a, b) => a.planeId.localeCompare(b.planeId)) // Sort by planeId
                .map((airplane) => (
                    <option key={airplane._id} value={airplane._id}>
                    {airplane.planeId}
                    </option>
                ))}
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="route" className="form-label">Route</label>
            <select
            className="form-select"
            id="route"
            name="route"
            value={newFlight.route}
            onChange={handleInputChange} 
            required
            >
            <option value="">Select Route</option>
            {routes
                .sort((a, b) => a.departure.airportCity.localeCompare(b.departure.airportCity))
                .map((route) => (
                <option key={route._id} value={route._id}>
                {route.departure.airportCity}-{route.departure.airportCode} to {route.destination.airportCity}-{route.destination.airportCode}
                </option>
            ))}
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="day" className="form-label">Day</label>
            <select
            className="form-select"
            id="day"
            name="day"
            value={newFlight.day}
            onChange={handleInputChange}
            required
            >
            <option value="">Select Day</option>
            <option value={1}>Sunday</option>
            <option value={2}>Monday</option>
            <option value={3}>Tuesday</option>
            <option value={4}>Wednesday</option>
            <option value={5}>Thursday</option>
            <option value={6}>Friday</option>
            <option value={7}>Saturday</option>
            </select>
        </div>

        <div className="mb-3">
            <label htmlFor="time" className="form-label">Time (HH:mm)</label>
            <input
            type="text"
            className="form-control"
            id="time"
            name="time"
            value={newFlight.time}
            onChange={handleInputChange}
            required
            placeholder="Enter time (e.g., 14:30)"
            />
        </div>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
            </Button>
            <Button type="submit" variant="primary">
            Add Flight
            </Button>
        </Modal.Footer>
        </form>
    </Modal.Body>
    </Modal>
    </div>
  );
}




