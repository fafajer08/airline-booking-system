import React, { useState, useEffect, useContext } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import UserContext from "../context/UserContext";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminUserDash() {
  const { user } = useContext(UserContext);
  const notyf = new Notyf({ duration: 3000 });
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [columnSearch, setColumnSearch] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    acculatedDistance: "",
    acculatedPayment: "",
    isAdmin: "",
    isActive: "",
  });
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    acculatedDistance: 0,
    acculatedPayment: 0,
    isAdmin: false,
    isActive: true,
  });

  // Loading states
  const [loadingData, setLoadingData] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
          notyf.success("Users fetched successfully.");
        } else {
          setUsers([]);
          notyf.error("No users found.");
        }
      } catch (error) {
        notyf.error('There was a problem fetching users.');
        console.error('Error:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUsers();
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
  const getSortedUsers = () => {
    const sortedUsers = Array.isArray(users) ? [...users] : [];
    if (sortConfig.key) {
      sortedUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortedUsers;
  };

  const filteredUsers = getSortedUsers().filter((user) =>
    Object.keys(columnSearch).every((key) => {
      const userValue = user[key];
      const searchValue = columnSearch[key];

      if (searchValue === "") {
        return true;
      }

      if (typeof userValue === "string") {
        return userValue.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (typeof userValue === "number") {
        return userValue === Number(searchValue);
      }

      if (typeof userValue === "boolean") {
        return userValue === (searchValue === "true");
      }

      return true;
    })
  );

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleRowClick = (user) => {
    setSelectedUser(user);
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
          <option value="true">True</option>
          <option value="false">False</option>
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
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      acculatedDistance: "",
      acculatedPayment: "",
      isAdmin: "",
      isActive: "",
    });
    notyf.success("Search filters cleared.");
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    setAddingUser(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newUser),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add new user: ${response.status} ${responseData.message}`);
      }

      setUsers((prevUsers) => [...prevUsers, responseData]);
      setAddModalVisible(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNo: "",
        acculatedDistance: 0,
        acculatedPayment: 0,
        isAdmin: false,
        isActive: true,
      });
      notyf.success('User added successfully.');
    } catch (error) {
      notyf.error(`Error adding user: ${error.message}`);
      console.error('Error:', error);
    } finally {
      setAddingUser(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
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
            "Add User"
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
              {renderTableHeader("Email", "email")}
              {renderTableHeader("Phone No", "phoneNo")}
              {renderTableHeader("Acc. Distance", "acculatedDistance")}
              {renderTableHeader("Acc. Payment", "acculatedPayment")}
              {renderTableHeader("Admin", "isAdmin")}
              {renderTableHeader("Active", "isActive")}
            </tr>
            <tr>
              {renderTableSearch("firstName", "text")}
              {renderTableSearch("lastName", "text")}
              {renderTableSearch("email", "text")}
              {renderTableSearch("phoneNo", "text")}
              {renderTableSearch("acculatedDistance", "number")}
              {renderTableSearch("acculatedPayment", "number")}
              {renderTableSearch("isAdmin", "boolean")}
              {renderTableSearch("isActive", "boolean")}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paginatedUsers) && paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user._id} onClick={() => handleRowClick(user)}>
                  <td>{user.firstName || 'N/A'}</td>
                  <td>{user.lastName || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.phoneNo || 'N/A'}</td>
                  <td>{user.acculatedDistance || 0}</td>
                  <td>{user.acculatedPayment || 0}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {!loadingData && Array.isArray(filteredUsers) && filteredUsers.length > 0 && (
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

      {selectedUser && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-details-body">
            <p><strong>First Name:</strong> {selectedUser.firstName || 'N/A'}</p>
            <p><strong>Last Name:</strong> {selectedUser.lastName || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
            <p><strong>Phone No:</strong> {selectedUser.phoneNo || 'N/A'}</p>
            <p><strong>Acc. Distance:</strong> {selectedUser.acculatedDistance || 0}</p>
            <p><strong>Acc. Payment:</strong> {selectedUser.acculatedPayment || 0}</p>
            <p><strong>Admin:</strong> {selectedUser.isAdmin ? 'Yes' : 'No'}</p>
            <p><strong>Status:</strong> {selectedUser.isActive ? "Active" : "Inactive"}</p>
            <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString() || 'N/A'}</p>
            <p><strong>Last Update:</strong> {new Date(selectedUser.updatedAt).toLocaleString() || 'N/A'}</p>
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
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddUser}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={newUser.firstName}
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
                value={newUser.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter last name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                placeholder="Enter password"
                minLength={6}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNo" className="form-label">Phone No</label>
              <input
                type="text"
                className="form-control"
                id="phoneNo"
                name="phoneNo"
                value={newUser.phoneNo}
                onChange={handleInputChange}
                required
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="acculatedDistance" className="form-label">Acculated Distance</label>
              <input
                type="number"
                className="form-control"
                id="acculatedDistance"
                name="acculatedDistance"
                value={newUser.acculatedDistance}
                onChange={handleInputChange}
                placeholder="Enter accumulated distance"
                min="0"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="acculatedPayment" className="form-label">Acculated Payment</label>
              <input
                type="number"
                className="form-control"
                id="acculatedPayment"
                name="acculatedPayment"
                value={newUser.acculatedPayment}
                onChange={handleInputChange}
                placeholder="Enter accumulated payment"
                min="0"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="isAdmin" className="form-label">Admin</label>
              <select
                className="form-select"
                id="isAdmin"
                name="isAdmin"
                value={newUser.isAdmin ? "true" : "false"}
                onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.value === "true" })}
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="isActive" className="form-label">Status</label>
              <select
                className="form-select"
                id="isActive"
                name="isActive"
                value={newUser.isActive ? "true" : "false"}
                onChange={(e) => setNewUser({ ...newUser, isActive: e.target.value === "true" })}
                required
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={addingUser}>
                {addingUser ? (
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
                  "Add User"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
