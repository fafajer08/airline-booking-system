// import React, { useState, useEffect } from "react";
// import ModalPrompt from "./ModalPrompt";

// export default function AdminFlightsDash() {
//   const [flights, setFlights] = useState([]);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isModalVisible, setModalVisible] = useState(false); 
//   const [fieldsConfig, setFieldsConfig] = useState([]);
//   const [apiDetails, setApiDetails] = useState({ apiUrl: "", method: "POST", needsAuth: true });

//   const apiBaseUrl = "/api/flights";

//   // Mock flight data with initial status
//   const mockFlights = [
//     {
//       departureDate: "2024-09-15",
//       departureAirport: "JFK",
//       destinationAirport: "LAX",
//       departureTime: "14:00",
//       flightNumber: "AA123",
//       seats: 200,
//       booked: 150,
//       status: "On Time",
//       actionStatus: "", // Empty status initially
//     },
//     {
//       departureDate: "2024-09-16",
//       departureAirport: "ORD",
//       destinationAirport: "ATL",
//       departureTime: "18:30",
//       flightNumber: "DL456",
//       seats: 180,
//       booked: 180,
//       status: "Full",
//       actionStatus: "", // Empty status initially
//     },
//     {
//       departureDate: "2024-09-17",
//       departureAirport: "SFO",
//       destinationAirport: "SEA",
//       departureTime: "08:00",
//       flightNumber: "UA789",
//       seats: 150,
//       booked: 120,
//       status: "Delayed",
//       actionStatus: "", // Empty status initially
//     },
//   ];

//   useEffect(() => {
//     // Fetching from API or using mock data
//     async function fetchFlights() {
//       try {
//         const response = await fetch("/api/flights");
//         if (response.ok) {
//           const data = await response.json();
//           setFlights(data);
//         } else {
//           setFlights(mockFlights); // Use mock data if API fails
//         }
//       } catch (error) {
//         setFlights(mockFlights); // Use mock data if API fails
//       }
//     }
//     fetchFlights();
//   }, []);

//   // Sorting logic
//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedFlights = React.useMemo(() => {
//     let sortableFlights = [...flights];
//     if (sortConfig.key !== null) {
//       sortableFlights.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "ascending" ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableFlights;
//   }, [flights, sortConfig]);

//   // Filter the flights based on search query
//   const filteredFlights = sortedFlights.filter((flight) =>
//     flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     flight.departureAirport.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     flight.destinationAirport.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     flight.status.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Action button handlers with confirmation and row color change
//   const updateFlightStatus = (flightNumber, status) => {
//     setFlights((prevFlights) =>
//       prevFlights.map((flight) =>
//         flight.flightNumber === flightNumber
//           ? { ...flight, actionStatus: status }
//           : flight
//       )
//     );
//   };

//   const handleCancel = (flightNumber) => {
//     if (window.confirm(`Are you sure you want to cancel flight ${flightNumber}?`)) {
//       updateFlightStatus(flightNumber, "cancel");
//     }
//   };

//   const handleHold = (flightNumber) => {
//     if (window.confirm(`Are you sure you want to hold flight ${flightNumber}?`)) {
//       updateFlightStatus(flightNumber, "hold");
//     }
//   };

//   const handleOk = (flightNumber) => {
//     if (window.confirm(`Are you sure you want to mark flight ${flightNumber} as OK?`)) {
//       updateFlightStatus(flightNumber, "ok");
//     }
//   };

//   const handleAddFlight = () => {
//     setApiDetails({ apiUrl: apiBaseUrl, method: "POST", needsAuth: true });
  
//     // Set the fieldsConfig for adding a new flight dynamically
//     setFieldsConfig([
//       { label: "Departure Date", name: "departureDate", type: "date" },
//       { label: "Departure Airport", name: "departureAirport", type: "text" },
//       { label: "Destination Airport", name: "destinationAirport", type: "text" },
//       { label: "Departure Time", name: "departureTime", type: "time" },
//       { label: "Flight Number", name: "flightNumber", type: "text" },
//       { label: "Seats", name: "seats", type: "number" },
//       { label: "Booked Seats", name: "booked", type: "number" },
//       {
//         label: "Status",
//         name: "status",
//         type: "select",
//         options: [
//           { label: "On Time", value: "On Time" },
//           { label: "Delayed", value: "Delayed" },
//           { label: "Full", value: "Full" },
//         ],
//       },
//     ]);
  
//     setModalVisible(true);  // Open the modal
//   };
//   const handleEditFlight = (flight) => {
//     setApiDetails({
//       apiUrl: `${apiBaseUrl}/${flight.flightNumber}`,
//       method: "PUT",
//       needsAuth: true,
//     });

//     // Set the fieldsConfig dynamically for editing the flight
//     setFieldsConfig([
//       { label: "Departure Date", name: "departureDate", type: "date", value: flight.departureDate },
//       { label: "Departure Airport", name: "departureAirport", type: "text", value: flight.departureAirport },
//       { label: "Destination Airport", name: "destinationAirport", type: "text", value: flight.destinationAirport },
//       { label: "Departure Time", name: "departureTime", type: "time", value: flight.departureTime },
//       { label: "Flight Number", name: "flightNumber", type: "text", value: flight.flightNumber },
//       { label: "Seats", name: "seats", type: "number", value: flight.seats },
//       { label: "Booked Seats", name: "booked", type: "number", value: flight.booked },
//       {
//         label: "Status",
//         name: "status",
//         type: "select",
//         options: [
//           { label: "On Time", value: "On Time" },
//           { label: "Delayed", value: "Delayed" },
//           { label: "Full", value: "Full" },
//         ],
//         value: flight.status,
//       },
//     ]);

//     setModalVisible(true);
//   };

//   // Function to get the CSS class based on status
//   const getRowClass = (actionStatus) => {
//     switch (actionStatus) {
//       case "cancel":
//         return "row-cancel"; // Light red tint
//       case "hold":
//         return "row-hold"; // Light yellow tint
//       case "ok":
//         return "row-ok"; // Light green tint
//       default:
//         return "row-default"; // Default row color
//     }
//   };

//   return (
//     <div>
//       {/* Search Input */}
//       <div>
//         <input
//           type="text"
//           placeholder="Search by flight number, airport, or status"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button type="button" onClick={handleAddFlight}>
//           Add Flight
//         </button>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th onClick={() => handleSort("departureDate")}>DEPARTURE DATE</th>
//             <th onClick={() => handleSort("departureAirport")}>DEPARTURE AIRPORT</th>
//             <th onClick={() => handleSort("destinationAirport")}>DESTINATION AIRPORT</th>
//             <th onClick={() => handleSort("departureTime")}>DEPARTURE TIME</th>
//             <th onClick={() => handleSort("flightNumber")}>FLIGHT NUMBER</th>
//             <th onClick={() => handleSort("seats")}>SEATS</th>
//             <th onClick={() => handleSort("booked")}>BOOKED</th>
//             <th onClick={() => handleSort("status")}>STATUS</th>
//             <th>ACTIONS</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredFlights.length > 0 ? (
//             filteredFlights.map((flight, index) => (
//               <tr key={index} className={getRowClass(flight.actionStatus)}>
//                 <td>{flight.departureDate}</td>
//                 <td>{flight.departureAirport}</td>
//                 <td>{flight.destinationAirport}</td>
//                 <td>{flight.departureTime}</td>
//                 <td>{flight.flightNumber}</td>
//                 <td>{flight.seats}</td>
//                 <td>{flight.booked}</td>
//                 <td>{flight.status}</td>
//                 <td>
//                   <button onClick={() => handleCancel(flight.flightNumber)}>Cancel</button>
//                   <button onClick={() => handleHold(flight.flightNumber)}>Hold</button>
//                   <button onClick={() => handleOk(flight.flightNumber)}>OK</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="9">No flights available</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <ModalPrompt
//         isVisible={isModalVisible}
//         onClose={() => setModalVisible(false)}
//         apiUrl={apiDetails.apiUrl}
//         method={apiDetails.method}
//         needsAuth={apiDetails.needsAuth}
//         fieldsConfig={fieldsConfig}
//       />
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminPassengerDash() {
  const notyf = new Notyf({ duration: 3000 });
  const [passengers, setPassengers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    passportNo: "",
    birthday: "",
    email: "",
    phoneNo: "",
  });
  const [newPassenger, setNewPassenger] = useState({
    firstName: "",
    lastName: "",
    nationality: "",
    passportNo: "",
    birthday: "",
    email: "",
    phoneNo: "",
  });

  // Loading states
  const [loadingData, setLoadingData] = useState(true);
  const [addingPassenger, setAddingPassenger] = useState(false);
  const [togglingPassengerId, setTogglingPassengerId] = useState(null);

  useEffect(() => {
    const fetchPassengers = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/passengers/all`);
        if (!response.ok) {
          throw new Error(`Error fetching passengers: ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPassengers(data);
          notyf.success("Passengers fetched successfully.");
        } else {
          setPassengers([]);
          notyf.error("No passengers found.");
        }
      } catch (error) {
        notyf.error('There was a problem fetching passengers.');
        console.error('Error:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchPassengers();
  }, []);

  // HANDLE SORTING
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // SORTING LOGIC
  const getSortedPassengers = () => {
    const sortedPassengers = Array.isArray(passengers) ? [...passengers] : [];
    if (sortConfig.key) {
      sortedPassengers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedPassengers;
  };

  const filteredPassengers = getSortedPassengers().filter((passenger) =>
    Object.keys(columnSearch).every((key) => {
      const passengerValue = passenger[key];
      const searchValue = columnSearch[key];

      if (searchValue === "") {
        return true;
      }

      if (typeof passengerValue === "string") {
        return passengerValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (typeof passengerValue === "number") {
        return passengerValue === Number(searchValue);
      }

      return true;
    })
  );

  const paginatedPassengers = filteredPassengers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredPassengers.length / rowsPerPage);

  const handleRowClick = (passenger) => {
    setSelectedPassenger(passenger);
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
      <input
        type={type === 'date' ? 'date' : 'text'}
        value={columnSearch[key] || ""}
        onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
        placeholder={`Search ${key}`}
        className="table-search-input"
      />
    </td>
  );

  const handleClearSearch = () => {
    setColumnSearch({
      firstName: "",
      lastName: "",
      nationality: "",
      passportNo: "",
      birthday: "",
      email: "",
      phoneNo: "",
    });
    notyf.success("Search filters cleared.");
  };

  const handleCloseAddModal = () => setAddModalVisible(false);

  const handleAddPassenger = async (event) => {
    event.preventDefault();
    setAddingPassenger(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/passengers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newPassenger),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add new passenger: ${response.status} ${responseData.message}`);
      }

      setPassengers((prevPassengers) => [...prevPassengers, responseData]);
      setAddModalVisible(false);
      setNewPassenger({
        firstName: "",
        lastName: "",
        nationality: "",
        passportNo: "",
        birthday: "",
        email: "",
        phoneNo: "",
      });
      notyf.success('Passenger added successfully.');
    } catch (error) {
      notyf.error(`Error adding passenger: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setAddingPassenger(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPassenger((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button 
          variant="primary" 
          onClick={() => setAddModalVisible(true)}
          disabled={loadingData}
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
            "Add Passenger"
          )}
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleClearSearch} 
          className="ms-2"
          disabled={loadingData}
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

      {loadingData ? (
        <div className="d-flex justify-content-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {renderTableHeader("First Name", "firstName")}
              {renderTableHeader("Last Name", "lastName")}
              {renderTableHeader("Nationality", "nationality")}
              {renderTableHeader("Passport No", "passportNo")}
              {renderTableHeader("Birthday", "birthday")}
              {renderTableHeader("Email", "email")}
              {renderTableHeader("Phone No", "phoneNo")}
            </tr>
            <tr>
              {renderTableSearch("firstName", "text")}
              {renderTableSearch("lastName", "text")}
              {renderTableSearch("nationality", "text")}
              {renderTableSearch("passportNo", "text")}
              {renderTableSearch("birthday", "date")}
              {renderTableSearch("email", "text")}
              {renderTableSearch("phoneNo", "text")}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paginatedPassengers) && paginatedPassengers.length > 0 ? (
              paginatedPassengers.map((passenger) => (
                <tr key={passenger._id} onClick={() => handleRowClick(passenger)}>
                  <td>{passenger.firstName || 'N/A'}</td>
                  <td>{passenger.lastName || 'N/A'}</td>
                  <td>{passenger.nationality || 'N/A'}</td>
                  <td>{passenger.passportNo || 'N/A'}</td>
                  <td>{new Date(passenger.birthday).toLocaleDateString() || 'N/A'}</td>
                  <td>{passenger.email || 'N/A'}</td>
                  <td>{passenger.phoneNo || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No passengers available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {!loadingData && Array.isArray(filteredPassengers) && filteredPassengers.length > 0 && (
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

      {selectedPassenger && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Passenger Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>First Name:</strong> {selectedPassenger.firstName || 'N/A'}</p>
            <p><strong>Last Name:</strong> {selectedPassenger.lastName || 'N/A'}</p>
            <p><strong>Nationality:</strong> {selectedPassenger.nationality || 'N/A'}</p>
            <p><strong>Passport No:</strong> {selectedPassenger.passportNo || 'N/A'}</p>
            <p><strong>Birthday:</strong> {new Date(selectedPassenger.birthday).toLocaleDateString() || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedPassenger.email || 'N/A'}</p>
            <p><strong>Phone No:</strong> {selectedPassenger.phoneNo || 'N/A'}</p>
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
          <Modal.Title>Add New Passenger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddPassenger}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={newPassenger.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={newPassenger.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter last name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="nationality" className="form-label">Nationality</label>
              <input
                type="text"
                className="form-control"
                id="nationality"
                name="nationality"
                value={newPassenger.nationality}
                onChange={handleInputChange}
                required
                placeholder="Enter nationality"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="passportNo" className="form-label">Passport No</label>
              <input
                type="text"
                className="form-control"
                id="passportNo"
                name="passportNo"
                value={newPassenger.passportNo}
                onChange={handleInputChange}
                placeholder="Enter passport number (optional)"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="birthday" className="form-label">Birthday</label>
              <input
                type="date"
                className="form-control"
                id="birthday"
                name="birthday"
                value={newPassenger.birthday}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={newPassenger.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNo" className="form-label">Phone No</label>
              <input
                type="text"
                className="form-control"
                id="phoneNo"
                name="phoneNo"
                value={newPassenger.phoneNo}
                onChange={handleInputChange}
                required
                placeholder="Enter phone number"
              />
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={addingPassenger}>
                {addingPassenger ? (
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
                  "Add Passenger"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

