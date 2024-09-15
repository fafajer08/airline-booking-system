import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AdminPromoDash() {
    const notyf = new Notyf({ duration: 3000 });
    const [promos, setPromos] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [columnSearch, setColumnSearch] = useState({
      promoName: '',
      promoCode: '',
      discount: '',
      absolutePricing: '',
      promoStart: '',
      promoEnd: '',
      numberOfSlots: '',
      isActive: '',
    });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [newPromo, setNewPromo] = useState({
      promoName: '',
      promoCode: '',
      discount: '',
      absolutePricing: '',
      promoStart: '',
      promoEnd: '',
      numberOfSlots: '',
    });
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch promos from backend
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/promos/all`);
        const data = await response.json();
        setPromos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching promos:', error);
        setPromos([]);
      }
    };
    fetchPromos();
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Toggle isActive status
  const toggleIsActive = async (id, isActive) => {
    const action = isActive ? 'archive' : 'activate';
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/promos/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        setPromos((prevPromos) =>
          prevPromos.map((promo) =>
            promo._id === id ? { ...promo, isActive: !promo.isActive } : promo
          )
        );
        notyf.success(`Promo ${isActive ? 'archived' : 'activated'} successfully.`);
      } else {
        notyf.error(`Failed to ${isActive ? 'archive' : 'activate'} the promo.`);
      }
    } catch (error) {
      notyf.error('Error updating promo status.');
    }
  };

  // Get sorted promos
  const getSortedPromos = () => {
    const sortedPromos = Array.isArray(promos) ? [...promos] : [];
    if (sortConfig.key) {
      sortedPromos.sort((a, b) => {
        if (!a || !b) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'ascending' ? 1 : -1;

        // Convert date strings to timestamps for comparison
        if (sortConfig.key === 'promoStart' || sortConfig.key === 'promoEnd') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortedPromos;
  };

// Update filtering logic for promoStart and promoEnd
const filteredPromos = getSortedPromos().filter((promo) =>
    Object.keys(columnSearch).every((key) => {
      const searchValue = columnSearch[key];
  
      if (key === 'promoStart' || key === 'promoEnd') {
        if (searchValue) {
          const searchDate = new Date(searchValue).setHours(0, 0, 0, 0);
          const promoStartDate = new Date(promo.promoStart).setHours(0, 0, 0, 0);
          const promoEndDate = new Date(promo.promoEnd).setHours(0, 0, 0, 0);
  
          // Check if the promo's date range includes the search date
          if (searchDate < promoStartDate || searchDate > promoEndDate) {
            return false;
          }
        }
        return true;
      } else {
        // Existing logic for other fields
        const value = searchValue.trim();
        if (!value) return true;
        const promoValue = promo[key];
        if (promoValue == null) return false;
  
        if (typeof promoValue === 'string') {
          return promoValue.toLowerCase().includes(value.toLowerCase());
        }
        if (typeof promoValue === 'number') {
          return promoValue.toString().includes(value);
        }
        if (typeof promoValue === 'boolean') {
          return promoValue.toString() === value;
        }
        return false;
      }
    })
  );
  
  

  const paginatedPromos = filteredPromos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredPromos.length / rowsPerPage) || 1;

  // Render table header
  const renderTableHeader = (label, key) => {
    return (
      <th onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
        {label} {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
      </th>
    );
  };

  // Render search inputs
  const renderTableSearch = (key, type) => (
    <td>
      {key === 'promoStart' || key === 'promoEnd' ? (
        <input
          type="date"
          value={columnSearch[key] || ''}
          onChange={(e) =>
            setColumnSearch({
              ...columnSearch,
              [key]: e.target.value,
            })
          }
          className="table-search-input"
        />
      ) : type === 'number' ? (
        <input
          type="number"
          value={columnSearch[key] || ''}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder="Search"
          className="table-search-input"
        />
      ) : type === 'boolean' ? (
        <select
          value={columnSearch[key] || ''}
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
          value={columnSearch[key] || ''}
          onChange={(e) => setColumnSearch({ ...columnSearch, [key]: e.target.value })}
          placeholder="Search"
          className="table-search-input"
        />
      )}
    </td>
  );

  // Handle opening and closing modals
  const handleRowClick = (promo) => {
    setSelectedPromo(promo);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  // Handle adding a new promo
  const handleAddPromo = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (
      !newPromo.promoName ||
      !newPromo.promoCode ||
      !newPromo.discount ||
      !newPromo.promoStart ||
      !newPromo.promoEnd
    ) {
      notyf.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/promos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newPromo),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to add new promo: ${response.status} ${responseData.message}`);
      }

      setPromos((prevPromos) => [...prevPromos, responseData]);
      setAddModalVisible(false);
      notyf.success('Promo added successfully.');
    } catch (error) {
      console.error('Error adding promo:', error);
      notyf.error('Error adding promo.');
    }
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => setAddModalVisible(true)}>
          Add Promo
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            setColumnSearch({
              promoName: '',
              promoCode: '',
              discount: '',
              absolutePricing: '',
              promoStart: { start: '', end: '' },
              promoEnd: { start: '', end: '' },
              numberOfSlots: '',
              isActive: '',
            })
          }
          className="ms-2"
        >
          Clear Search
        </Button>
        <select
          className="ms-auto"
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
            {renderTableHeader('Promo Name', 'promoName')}
            {renderTableHeader('Promo Code', 'promoCode')}
            {renderTableHeader('Discount (%)', 'discount')}
            {renderTableHeader('Absolute Pricing', 'absolutePricing')}
            {renderTableHeader('Promo Start', 'promoStart')}
            {renderTableHeader('Promo End', 'promoEnd')}
            {renderTableHeader('Number of Slots', 'numberOfSlots')}
            {renderTableHeader('Status', 'isActive')}
          </tr>
          <tr>
            {renderTableSearch('promoName', 'text')}
            {renderTableSearch('promoCode', 'text')}
            {renderTableSearch('discount', 'number')}
            {renderTableSearch('absolutePricing', 'number')}
            {renderTableSearch('promoStart', 'date')}
            {renderTableSearch('promoEnd', 'date')}
            {renderTableSearch('numberOfSlots', 'number')}
            {renderTableSearch('isActive', 'boolean')}
          </tr>
        </thead>
        <tbody>
          {paginatedPromos.length > 0 ? (
            paginatedPromos.map((promo) => (
              <tr key={promo._id} onClick={() => handleRowClick(promo)}>
                <td>{promo.promoName || 'N/A'}</td>
                <td>{promo.promoCode || 'N/A'}</td>
                <td>{promo.discount != null ? promo.discount : 'N/A'}</td>
                <td>{promo.absolutePricing != null ? promo.absolutePricing : 'N/A'}</td>
                <td>{promo.promoStart ? promo.promoStart.slice(0, 10) : 'N/A'}</td>
                <td>{promo.promoEnd ? promo.promoEnd.slice(0, 10) : 'N/A'}</td>
                <td>{promo.numberOfSlots != null ? promo.numberOfSlots : 'N/A'}</td>
                <td>
                  <Button
                    variant={promo.isActive ? 'success' : 'danger'}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      toggleIsActive(promo._id, promo.isActive);
                    }}
                  >
                    {promo.isActive ? 'Activated' : 'Archived'}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No promos available</td>
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
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>

      {/* MODAL FOR ADDING A NEW PROMO */}
      <Modal show={isAddModalVisible} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Promo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddPromo}>
            <div className="mb-3">
              <label htmlFor="promoName" className="form-label">
                Promo Name
              </label>
              <input
                type="text"
                className="form-control"
                id="promoName"
                name="promoName"
                value={newPromo.promoName}
                onChange={handleInputChange}
                required
                placeholder="Enter promo name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="promoCode" className="form-label">
                Promo Code
              </label>
              <input
                type="text"
                className="form-control"
                id="promoCode"
                name="promoCode"
                value={newPromo.promoCode}
                onChange={handleInputChange}
                required
                placeholder="Enter promo code"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="discount" className="form-label">
                Discount (%)
              </label>
              <input
                type="number"
                className="form-control"
                id="discount"
                name="discount"
                value={newPromo.discount}
                onChange={handleInputChange}
                required
                placeholder="Enter discount percentage"
                min="0"
                max="100"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="absolutePricing" className="form-label">
                Absolute Pricing
              </label>
              <input
                type="number"
                className="form-control"
                id="absolutePricing"
                name="absolutePricing"
                value={newPromo.absolutePricing}
                onChange={handleInputChange}
                placeholder="Enter absolute discount amount"
                min="0"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="promoStart" className="form-label">
                Promo Start
              </label>
              <input
                type="date"
                className="form-control"
                id="promoStart"
                name="promoStart"
                value={newPromo.promoStart}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="promoEnd" className="form-label">
                Promo End
              </label>
              <input
                type="date"
                className="form-control"
                id="promoEnd"
                name="promoEnd"
                value={newPromo.promoEnd}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="numberOfSlots" className="form-label">
                Number of Slots
              </label>
              <input
                type="number"
                className="form-control"
                id="numberOfSlots"
                name="numberOfSlots"
                value={newPromo.numberOfSlots}
                onChange={handleInputChange}
                placeholder="Enter number of slots (0 for unlimited)"
                min="0"
              />
            </div>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Add Promo
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      {/* MODAL FOR PROMO DETAILS */}
      {selectedPromo && (
        <Modal show={isModalVisible} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Promo Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Promo Name:</strong> {selectedPromo.promoName || 'N/A'}
            </p>
            <p>
              <strong>Promo Code:</strong> {selectedPromo.promoCode || 'N/A'}
            </p>
            <p>
              <strong>Discount (%):</strong>{' '}
              {selectedPromo.discount != null ? selectedPromo.discount : 'N/A'}
            </p>
            <p>
              <strong>Absolute Pricing:</strong>{' '}
              {selectedPromo.absolutePricing != null ? selectedPromo.absolutePricing : 'N/A'}
            </p>
            <p>
              <strong>Promo Start:</strong>{' '}
              {selectedPromo.promoStart ? new Date(selectedPromo.promoStart).toLocaleDateString() : 'N/A'}
            </p>
            <p>
              <strong>Promo End:</strong>{' '}
              {selectedPromo.promoEnd ? new Date(selectedPromo.promoEnd).toLocaleDateString() : 'N/A'}
            </p>
            <p>
              <strong>Number of Slots:</strong>{' '}
              {selectedPromo.numberOfSlots != null ? selectedPromo.numberOfSlots : 'N/A'}
            </p>
            <p>
              <strong>Status:</strong> {selectedPromo.isActive ? 'Activated' : 'Archived'}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {selectedPromo.createdAt ? new Date(selectedPromo.createdAt).toLocaleString() : 'N/A'}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {selectedPromo.updatedAt ? new Date(selectedPromo.updatedAt).toLocaleString() : 'N/A'}
            </p>
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
