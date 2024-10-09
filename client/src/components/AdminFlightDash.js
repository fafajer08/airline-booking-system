import React, { useState, useEffect } from "react";
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Modal, Button, ToggleButton, Spinner } from 'react-bootstrap';


export default function AdminFlightDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [flights, setFlights] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [pricings, setPricings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [commercialFlights, setCommercialFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(""); // For price selection
  const [isModalVisible, setModalVisible] = useState(false); // For flight details
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isGenerateModalVisible, setGenerateModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [flightToGenerate, setFlightToGenerate] = useState(null);
  const [loading, setLoading] = useState(false);
  




  // Added columnSearch state for search functionality
  const [columnSearch, setColumnSearch] = useState({
    'flightNo': "",
    'airplane.planeId': "",
    'route.departure.airportCity': "",
    'route.departure.airportName': "",
    'route.destination.airportCity': "",
    'route.destination.airportName': "",
    'airplane.totalSeats': "",
    'day': "",
    'time': "",
    'isActive': ""
  });

  const [newFlight, setNewFlight] = useState({
    flightNo: "",
    airplane: "",
    route: "",
    days: [], 
    time: "",
    isActive: true
  });
  

  // Fetch flights, airplanes, routes, and pricing from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [flightsRes, airplanesRes, routesRes, pricingRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/flights/all`),
          fetch(`${process.env.REACT_APP_API_URL}/airplanes/all`),
          fetch(`${process.env.REACT_APP_API_URL}/routes/all`),
          fetch(`${process.env.REACT_APP_API_URL}/pricing/all`) 
        ]);
        const flightsData = await flightsRes.json();
        const airplanesData = await airplanesRes.json();
        const routesData = await routesRes.json();
        const pricingData = await pricingRes.json();

        setFlights(Array.isArray(flightsData) ? flightsData : []);
        setAirplanes(Array.isArray(airplanesData) ? airplanesData : []);
        setRoutes(Array.isArray(routesData) ? routesData : []);
        setPricings(Array.isArray(pricingData) ? pricingData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const mapDaysToWeekdays = (daysArray) => {
    if (!Array.isArray(daysArray)) return [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysArray.map(day => daysOfWeek[day - 1] || 'N/A');
  };
  
  

  // Function to toggle flight activation
  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate';
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/${action}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setFlights((prevFlights) => 
          prevFlights.map((flight) => 
            flight._id === id ? { ...flight, isActive: !flight.isActive } : flight
          )
        );
        notyf.success(`Flight ${isActive ? 'archived' : 'activated'} successfully.`);
      } else {
        notyf.error(`Failed to ${isActive ? 'archive' : 'activate'} the flight.`);
      }
    } catch (error) {
      notyf.error('Error updating flight status.');
    }
  };

  // Helper function to get nested value
  const getNestedValue = (object, keysArray) => {
    return keysArray.reduce((acc, key) => (acc ? acc[key] : undefined), object);
  };

  // Sorting logic
  const handleSort = (keysArray) => {
    const key = keysArray.join('.');
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sorted flights based on the selected sort key
  const getSortedFlights = () => {
    const sortedFlights = Array.isArray(flights) ? [...flights] : [];
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

 
  const filteredFlights = getSortedFlights().filter((flight) =>
    Object.keys(columnSearch).every((key) => {
      const searchValue = columnSearch[key].trim();
      if (!searchValue) return true;
  
      const flightValue = getNestedValue(flight, key.split('.'));
  
      if (key === 'days' && Array.isArray(flightValue)) {
        // Map days to weekdays and convert to a lowercase string
        const flightDays = mapDaysToWeekdays(flightValue).join(', ').toLowerCase();
        return flightDays.includes(searchValue.toLowerCase());
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
  


  const paginatedFlights = filteredFlights.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredFlights.length / rowsPerPage);

  const handleRowClick = (flight) => {
    if (!flight) return;
    setSelectedFlight(flight);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const openGenerateModal = (flight) => {
    setFlightToGenerate(flight);
    setGenerateModalVisible(true);
  };

  const handleCloseGenerateModal = () => {
    setGenerateModalVisible(false);
    setDateRange({ start: "", end: "" });
  };



  //   const handleGenerateCommercialFlights = async () => {
  //     if (!flightToGenerate || !dateRange.start || !dateRange.end || !selectedPrice) {
  //       notyf.error("Please select a flight, date range, and price.");
  //       return;
  //     }
    
  //     const startDate = new Date(dateRange.start);
  //     const endDate = new Date(dateRange.end);
  //     const generatedFlights = [];
    
  //     for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  //       if (d.getDay() + 1 === parseInt(flightToGenerate.day)) {
  //         // Use the time directly from flightToGenerate
  //         const departureTime = flightToGenerate.time; // e.g., "14:30"
    
  //         generatedFlights.push({
  //           flightId: flightToGenerate._id, // Use only the flight ID here
  //           date: new Date(d).toISOString().split('T')[0], // Store the date as "YYYY-MM-DD"
  //           priceId: selectedPrice,
  //           departureTime: departureTime, // Store the time as a string (e.g., "14:30")
  //         });
  //       }
  //     }
  
  //   console.log(`generatedFlights ${JSON.stringify(generatedFlights)}`);
  
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/multiple`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ flights: generatedFlights }),
  //     });
  
  //     const responseData = await response.json();
  //     if (!response.ok) {
  //       throw new Error(`Failed to generate commercial flights: ${response.status} ${responseData.message}`);
  //     }
  
  //     notyf.success("Commercial flights generated successfully.");
  //     setCommercialFlights((prev) => [...prev, ...responseData.added]); // Use responseData.added to update the list
  //     setGenerateModalVisible(false);
  //   } catch (error) {
  //     console.error('Error generating commercial flights:', error); // Log the error for debugging
  //     notyf.error('Error generating commercial flights.');
  //   }
  // };
 
  const handleGenerateCommercialFlights = async () => {
    if (!flightToGenerate || !dateRange.start || !dateRange.end || !selectedPrice) {
      notyf.error("Please select a flight, date range, and price.");
      return;
    }
    setLoading(true);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const generatedFlights = [];
  
    // Convert flightToGenerate.days to an array of numbers
    const flightDays = flightToGenerate.days.map(day => parseInt(day, 10));
  
    // Use a new date instance to avoid mutation issues
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      const dayOfWeek = currentDate.getDay() + 1; // 1 (Sun) to 7 (Sat)
  
      console.log(`Processing date: ${currentDate.toISOString().split('T')[0]}, dayOfWeek: ${dayOfWeek}`);
  
      // Check if the current day is in the flight's days array
      if (flightDays.includes(dayOfWeek)) {
        // Use the time directly from flightToGenerate
        const departureTime = flightToGenerate.time; // e.g., "14:30"
  
        generatedFlights.push({
          flightId: flightToGenerate._id, // Use only the flight ID here
          date: currentDate.toISOString().split('T')[0], // Store the date as "YYYY-MM-DD"
          priceId: selectedPrice,
          departureTime: departureTime, // Store the time as a string (e.g., "14:30")
        });
      }
    }
  
    console.log(`generatedFlights: ${JSON.stringify(generatedFlights)}`);
  
    if (generatedFlights.length === 0) {
      notyf.error("No flights to generate within the selected date range and days.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flights: generatedFlights }),
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to generate commercial flights: ${response.status} ${responseData.message}`);
      }
  
      notyf.success("Commercial flights generated successfully.");
      setCommercialFlights((prev) => [...prev, ...responseData.added]); // Use responseData.added to update the list
      setGenerateModalVisible(false);
    } catch (error) {
      console.error('Error generating commercial flights:', error); // Log the error for debugging
      notyf.error('Error generating commercial flights.');
    } finally {
      setLoading(false);
    }
  };
  
 
 
 
  const renderTableSearch = (key, type) => (
    <td>
        {key === 'days' ? (
          <input
            type="text"
            value={columnSearch[key] || ""}
            onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
            placeholder={`Search Days`}
            className="table-search-input"
          />
      ) : type === 'number' ? (
        <input
          type="number"
          value={columnSearch[key] || ""}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder={`Search`}
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
          placeholder={`Search`}
          className="table-search-input"
        />
      )}
    </td>
  );

  // Function to render table headers with sorting
  const renderTableHeader = (label, keysArray) => {
    const key = keysArray.join('.');
    return (
      <th onClick={() => handleSort(keysArray)} style={{ cursor: 'pointer' }}>
        {label} {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
      </th>
    );
  };

  

  const handleAddFlight = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    if (
      !newFlight.flightNo ||
      !newFlight.airplane ||
      !newFlight.route ||
      newFlight.days.length === 0 ||
      !newFlight.time
    ) {
      notyf.error('Please fill in all required fields.');
      return;
    }
  
    setLoading(true);
    try {
      // Send the entire newFlight object to the API, including the 'days' array
      const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newFlight),
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          `Failed to add new flight: ${response.status} ${responseData.message}`
        );
      }
  
      // Update the flights state with the newly added flight
      setFlights((prevFlights) => [...prevFlights, responseData]);
      setAddModalVisible(false); // Close the modal after adding the flight
      notyf.success('Flight added successfully.');
    } catch (error) {
      console.error('Error adding flight:', error);
      notyf.error('Error adding flight.');
    } finally {
      setLoading(false);
    }
  };
  


  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.currentTarget;
    setNewFlight((prev) => {
      if (checked) {
        // Add the day to the array
        return {
          ...prev,
          days: [...prev.days, value],
        };
      } else {
        // Remove the day from the array
        return {
          ...prev,
          days: prev.days.filter((day) => day !== value),
        };
      }
    });
  };
  

  return (
    <div className="dash-container">
          {loading && (
              <div className="spinner-overlay">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setAddModalVisible(true)}>Add Flight</Button>
        <Button variant="secondary" onClick={() => setColumnSearch({
          'flightNo': "",
          'airplane.planeId': "",
          'route.departure.airportCity': "",
          'route.departure.airportName': "",
          'route.destination.airportCity': "",
          'route.destination.airportName': "",
          'airplane.totalSeats': "",
          'day': "",
          'time': "",
          'isActive': ""
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
       
            {renderTableHeader("Flight No", ["flightNo"])}
            {renderTableHeader("Airplane Id", ["airplane", "planeId"])}
            {renderTableHeader("Departure City", ["route", "departure", "airportCity"])}
            {renderTableHeader("Departure Airport", ["route", "departure", "airportName"])}
            {renderTableHeader("Destination City", ["route", "destination", "airportCity"])}
            {renderTableHeader("Destination Airport", ["route", "destination", "airportName"])}
            {renderTableHeader("Total Seats", ["airplane", "totalSeats"])}
            {renderTableHeader("Days", ["days"])}
            {renderTableHeader("Time", ["time"])}
            {renderTableHeader("Status", ["isActive"])}
            <th>Action</th>
            
          </tr>
          {/* Added search inputs below the headers */}
          <tr>
            {renderTableSearch('flightNo', 'text')}
            {renderTableSearch('airplane.planeId', 'text')}
            {renderTableSearch('route.departure.airportCity', 'text')}
            {renderTableSearch('route.departure.airportName', 'text')}
            {renderTableSearch('route.destination.airportCity', 'text')}
            {renderTableSearch('route.destination.airportName', 'text')}
            {renderTableSearch('airplane.totalSeats', 'number')}
            {renderTableSearch('days', 'days')}
            {renderTableSearch('time', 'text')}
            {renderTableSearch('isActive', 'boolean')}
            <td></td>
          </tr>
        </thead>
        <tbody>
          {paginatedFlights.length > 0 ? (
            paginatedFlights.map((flight) => (
              <tr key={flight?._id} onClick={() => handleRowClick(flight)}>
                <td>{flight?.flightNo || 'N/A'}</td>
                <td>{flight?.airplane?.planeId || 'N/A'}</td>
                <td>{flight?.route?.departure?.airportCity || 'N/A'}</td>
                <td>{flight?.route?.departure?.airportName || 'N/A'}</td>
                <td>{flight?.route?.destination?.airportCity || 'N/A'}</td>
                <td>{flight?.route?.destination?.airportName || 'N/A'}</td>
                <td>{flight?.airplane?.totalSeats || 'N/A'}</td>
                <td>
                  {flight?.days && flight.days.length > 0
                    ? mapDaysToWeekdays(flight.days).join(', ')
                    : 'N/A'}
                </td>
                <td>{flight?.time || 'N/A'}</td>
                <td>
                  <Button
                  className="action-button"
                    variant={flight?.isActive ? "success" : "danger"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleIsActive(flight?._id, flight?.isActive);
                    }}
                  >
                    {flight?.isActive ? "Activated" : "Archived"}
                  </Button>
                </td>
                <td>
                  <Button 
                  className="action-button-commercial" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openGenerateModal(flight);
                  }}>Commercial Flight</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No flights available</td>
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

      {/* MODAL FOR FLIGHT DETAILS */}
      {selectedFlight && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Flight Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add flight details here */}
            <p><strong>Flight No:</strong> {selectedFlight?.flightNo || 'N/A'}</p>
            {/* Add more details as needed */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* MODAL FOR GENERATING COMMERCIAL FLIGHTS */}
      <Modal show={isGenerateModalVisible} onHide={handleCloseGenerateModal}>
        <Modal.Header closeButton>
        <Modal.Title>
            {flightToGenerate
              ? `${flightToGenerate.flightNo} - ${flightToGenerate.route.departure.airportCode} (${flightToGenerate.route.destination.airportCode}) - ${mapDaysToWeekdays(flightToGenerate.days).join(', ')}`
              : "Generate Commercial Flights"}
          </Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div>
            <label>Select Pricing:</label>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            >
              <option value="">Select Pricing</option>
              {pricings.map((price) => (
                <option key={price._id} value={price._id}>
                  {`${price.priceName}`}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseGenerateModal}>Close</Button>
          <Button variant="primary" onClick={handleGenerateCommercialFlights}>Generate</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL FOR ADDING A NEW FLIGHT */}
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
                {airplanes.map((plane) => (
                  <option key={plane._id} value={plane._id}>
                    {plane.planeId}
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
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {`${route.departure.airportCity} (${route.departure.airportCode}) - ${route.destination.airportCity} (${route.destination.airportCode})`}
                  </option>
                ))}
              </select>
            </div>


            <div className="mb-3">
              <label className="form-label">Days</label>
              <div className="toggle-button-group mb-3">
                {[
                  { name: 'Sun', value: '1' },
                  { name: 'Mon', value: '2' },
                  { name: 'Tue', value: '3' },
                  { name: 'Wed', value: '4' },
                  { name: 'Thu', value: '5' },
                  { name: 'Fri', value: '6' },
                  { name: 'Sat', value: '7' },
                ].map((day, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`toggle-day-${idx}`}
                    type="checkbox"
                    variant="outline-success"  // Add this back
                    value={day.value}
                    checked={newFlight.days.includes(day.value)}
                    onChange={handleDayChange}
                    className="toggle-button"
                  >
                    {day.name}
                </ToggleButton>

                ))}
              </div>
            </div>





            <div className="mb-3">
              <label htmlFor="time" className="form-label">Time</label>
              <input
                type="time"
                className="form-control"
                id="time"
                name="time"
                value={newFlight.time}
                onChange={handleInputChange}
                required
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



