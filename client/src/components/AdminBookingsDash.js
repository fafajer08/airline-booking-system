import React, { useState, useEffect } from "react";
//import '../styles/admin.css';  // Import the CSS file

export default function AdminBookingsDash() {
  const [bookings, setBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");

  // Mock booking data with initial status
  const mockBookings = [
    {
      flightNumber: "AA123",
      departureDate: "2024-09-15",
      firstName: "John",
      lastName: "Doe",
      birthday: "1990-05-20",
      age: 34,
      nationality: "American",
      contactNumber: "123-456-7890",
      email: "john.doe@example.com",
      price: 250,
      status: "Pending", // Default status
    },
    {
      flightNumber: "DL456",
      departureDate: "2024-09-16",
      firstName: "Jane",
      lastName: "Smith",
      birthday: "1985-10-12",
      age: 39,
      nationality: "Canadian",
      contactNumber: "987-654-3210",
      email: "jane.smith@example.com",
      price: 300,
      status: "Paid", // Default status
    },
    {
      flightNumber: "UA789",
      departureDate: "2024-09-17",
      firstName: "Alice",
      lastName: "Johnson",
      birthday: "1992-07-30",
      age: 32,
      nationality: "British",
      contactNumber: "555-123-4567",
      email: "alice.johnson@example.com",
      price: 180,
      status: "Pending", // Default status
    },
  ];


  useEffect(() => {
    // Fetching from API or using mock data
    async function fetchBookings() {
      try {
        const response = await fetch("/api/flights");
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
            setBookings(mockBookings); // Use mock data if API fails
        }
      } catch (error) {
        setBookings(mockBookings); // Use mock data if API fails
      }
    }
    fetchBookings();
  }, []);


  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedBookings = React.useMemo(() => {
    let sortableBookings = [...bookings];
    if (sortConfig.key !== null) {
      sortableBookings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBookings;
  }, [bookings, sortConfig]);

  // Filter the bookings based on search query
  const filteredBookings = sortedBookings.filter((booking) =>
    booking.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Action button handlers with confirmation and row color change
  const updateBookingStatus = (flightNumber, email, status) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.flightNumber === flightNumber && booking.email === email
          ? { ...booking, status: status }
          : booking
      )
    );
  };

  const handlePending = (flightNumber, email) => {
    if (window.confirm(`Are you sure you want to mark this booking as Pending?`)) {
      updateBookingStatus(flightNumber, email, "Pending");
    }
  };

  const handlePaid = (flightNumber, email) => {
    if (window.confirm(`Are you sure you want to mark this booking as Paid?`)) {
      updateBookingStatus(flightNumber, email, "Paid");
    }
  };

  // Function to get the CSS class based on status
  const getRowClass = (status) => {
    switch (status) {
      case "Paid":
        return "row-ok"; // Light green tint for paid
      case "Pending":
        return "row-hold"; // Light yellow tint for pending
      default:
        return "row-default"; // Default row color
    }
  };

  return (
    <div>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by flight number, name, email, or status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("flightNumber")}>FLIGHT NUMBER</th>
              <th onClick={() => handleSort("departureDate")}>DEPARTURE DATE</th>
              <th onClick={() => handleSort("firstName")}>FIRST NAME</th>
              <th onClick={() => handleSort("lastName")}>LAST NAME</th>
              <th onClick={() => handleSort("birthday")}>BIRTHDAY</th>
              <th onClick={() => handleSort("age")}>AGE</th>
              <th onClick={() => handleSort("nationality")}>NATIONALITY</th>
              <th onClick={() => handleSort("contactNumber")}>CONTACT NUMBER</th>
              <th onClick={() => handleSort("email")}>EMAIL</th>
              <th onClick={() => handleSort("price")}>PRICE</th>
              <th onClick={() => handleSort("status")}>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr key={index} className={getRowClass(booking.status)}>
                  <td>{booking.flightNumber}</td>
                  <td>{booking.departureDate}</td>
                  <td>{booking.firstName}</td>
                  <td>{booking.lastName}</td>
                  <td>{booking.birthday}</td>
                  <td>{booking.age}</td>
                  <td>{booking.nationality}</td>
                  <td>{booking.contactNumber}</td>
                  <td>{booking.email}</td>
                  <td>${booking.price}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button onClick={() => handlePending(booking.flightNumber, booking.email)}>Pending</button>
                    <button onClick={() => handlePaid(booking.flightNumber, booking.email)}>Paid</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No bookings available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  );
}
