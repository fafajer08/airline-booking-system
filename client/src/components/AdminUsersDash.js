import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import usersData from '../data/usersData';
import '../styles/admincomponentsdash.css';  // Ensure your styles are being used correctly

export default function AdminUsersDash() {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    isAdmin: "",
    isActive: "",
  });

  useEffect(() => {
    setUsers(usersData); // Use mock data until the backend is ready
  }, []);

  // Placeholder for updating user status in the backend
  const updateUserStatus = (userId, updatedUser) => {
    console.log(`Updating user ${userId} in the backend...`, updatedUser);
    // Replace the console.log with actual API call to update the backend
    // Example:
    // fetch(`/api/users/${userId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(updatedUser),
    // }).then(response => response.json());
  };

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Helper function for sorting
  const getSortedUsers = () => {
    const sortedUsers = [...users];
    if (sortConfig.key) {
      sortedUsers.sort((a, b) => {
        const aValue = sortConfig.key.includes('.')
          ? a[sortConfig.key.split('.')[0]][sortConfig.key.split('.')[1]]
          : a[sortConfig.key];
        const bValue = sortConfig.key.includes('.')
          ? b[sortConfig.key.split('.')[0]][sortConfig.key.split('.')[1]]
          : b[sortConfig.key];
          
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedUsers;
  };

  // Filter the users based on search inputs
  const filteredUsers = getSortedUsers().filter((user) =>
    Object.keys(columnSearch).every((key) => {
      const userValue = user[key];
  
      // Ensure userValue is a string before applying .toLowerCase()
      if (userValue && typeof userValue === "string") {
        return userValue.toLowerCase().includes(columnSearch[key].toLowerCase());
      }
  
      // If userValue is not a string, just return true (or you can add logic to filter booleans/numbers)
      return true; 
    })
  );

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Handle row click to show modal
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  // Toggle admin status with confirmation prompt
  const handleAdminClick = (index) => {
    const updatedUsers = [...users];
    const user = updatedUsers[index];
    const confirmAdminChange = window.confirm(
      `Do you want to change the admin status of ${user.firstName} ${user.lastName}?`
    );
    if (confirmAdminChange) {
      updatedUsers[index].isAdmin = !user.isAdmin;
      setUsers(updatedUsers);
      updateUserStatus(user.id, updatedUsers[index]);  // Call the backend update placeholder
      alert(`Admin status for ${user.firstName} ${user.lastName} has been changed to ${user.isAdmin ? "Yes" : "No"}`);
    }
  };

  // Toggle active status with confirmation prompt
  const handleActiveClick = (index) => {
    const updatedUsers = [...users];
    const user = updatedUsers[index];
    const confirmActiveChange = window.confirm(
      `Do you want to change the active status of ${user.firstName} ${user.lastName}?`
    );
    if (confirmActiveChange) {
      updatedUsers[index].isActive = !user.isActive;
      setUsers(updatedUsers);
      updateUserStatus(user.id, updatedUsers[index]);  // Call the backend update placeholder
      alert(`Active status for ${user.firstName} ${user.lastName} has been changed to ${user.isActive ? "Active" : "Archived"}`);
    }
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "▲" : "▼";
  };

  const handleHeaderClick = (key) => {
    handleSort(key);
  };

  // Helper for rendering table headers with sorting and search
  const renderTableHeader = (label, key) => (
    <th onClick={() => handleHeaderClick(key)}>
      {label} {renderSortArrow(key)}
      <input
        type="text"
        value={columnSearch[key] || ""}
        onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
        placeholder={`Search ${label}`}
        className="table-search-input"
      />
    </th>
  );

  return (
    <div className="admin-users-dash">
      {/* Search Input and Rows per Page */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, email, or phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Users Table */}
      <table>
        <thead>
          <tr>
            {renderTableHeader("FIRST NAME", "firstName")}
            {renderTableHeader("LAST NAME", "lastName")}
            {renderTableHeader("EMAIL", "email")}
            {renderTableHeader("PHONE", "phoneNo")}
            {renderTableHeader("ADMIN", "isAdmin")}
            {renderTableHeader("ACTIVE", "isActive")}
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNo}</td>
                <td>
                  <Button
                    variant={user.isAdmin ? "success" : "danger"}
                    onClick={() => handleAdminClick(index)}
                  >
                    {user.isAdmin ? "Yes" : "No"}
                  </Button>
                </td>
                <td>
                  <Button
                    variant={user.isActive ? "success" : "danger"}
                    onClick={() => handleActiveClick(index)}
                  >
                    {user.isActive ? "Active" : "Archived"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
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

      {/* Modal for User Details */}
      {selectedUser && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>User Details - {selectedUser.firstName} {selectedUser.lastName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phoneNo}</p>
            <p><strong>Admin:</strong> {selectedUser.isAdmin ? "Yes" : "No"}</p>
            <p><strong>Status:</strong> {selectedUser.isActive ? "Active" : "Archived"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
