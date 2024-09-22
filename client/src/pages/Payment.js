import React, { useState } from 'react';
import { BackButton, SubmitButton } from '../components/Buttons';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Payment() {
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility
  const [paymentMethod, setPaymentMethod] = useState(''); // State to track the selected payment method
  const [expiryMonth, setExpiryMonth] = useState(''); // State for expiration month
  const [expiryYear, setExpiryYear] = useState(''); // State for expiration year

  // Handle opening and closing of the modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle the radio button change for payment methods
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === 'creditCard') {
      handleShowModal(); // Show the modal when Credit Card is selected
    }
  };

  const currentYear = new Date().getFullYear();
  const expirationYears = Array.from(new Array(15), (val, index) => currentYear + index); // Generate next 15 years

  return (
    <div>
      <div className="container">
        <h5>How would you like to pay?</h5>
        <h2>Payment Method</h2>
        <div className='px-5 py-3'>
          <div>
            <h3>Credit or Debit Card</h3>
          </div>
          <div className=''>
            <input
              className=''
              type="radio"
              name="paymentMethod"
              id="creditCard"
              value="creditCard"
              onChange={handlePaymentChange}
            />
            <label className='px-5 py-3' htmlFor="creditCard">Credit, Debit or Prepaid Cards</label>
          </div>
        </div>

        <div className='px-5 py-3'>
          <div>
            <h3>E-Wallet</h3>
          </div>
          <div className=''>
            <input
              className=''
              type="radio"
              name="paymentMethod"
              id="alipay"
              value="alipay"
              onChange={handlePaymentChange}
            />
            <label className='px-5 py-3' htmlFor="alipay">Alipay</label>
          </div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              id="applepay"
              value="applepay"
              onChange={handlePaymentChange}
            />
            <label className='px-5 py-3' htmlFor="applepay">Apple Pay</label>
          </div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              id="googlepay"
              value="googlepay"
              onChange={handlePaymentChange}
            />
            <label className='px-5 py-3' htmlFor="googlepay">Google Pay</label>
          </div>
          <div>
            <input
              type="radio"
              name="paymentMethod"
              id="paypal"
              value="paypal"
              onChange={handlePaymentChange}
            />
            <label className='px-5 py-3' htmlFor="paypal">Paypal</label>
          </div>
        </div>

        <div>
          <p>By clicking the ‘Continue’ button below, I confirm that I have read, understood, and accept all the Conditions set by the airline.</p>
        </div>

        <div className='d-flex'>
          <div className='ms-auto'>
            <BackButton link="/bookings" />
            <SubmitButton />
          </div>
        </div>
      </div>

      {/* Modal for Credit Card details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Credit Card Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="cardName">
              <Form.Label>Name on Card</Form.Label>
              <Form.Control type="text" placeholder="Enter Name" />
            </Form.Group>

            <Form.Group controlId="cardNumber">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="text" placeholder="Enter card number" />
            </Form.Group>

            {/* Expiration Date - Improved Selection */}
            <Form.Group controlId="expiryDate" className="mt-3">
              <Form.Label>Expiration Date</Form.Label>
              <div className="d-flex">
                <Form.Control
                  as="select"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="me-2"
                >
                  <option value="" disabled>Select Month</option>
                  {Array.from({ length: 12 }, (v, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </Form.Control>

                <Form.Control
                  as="select"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                >
                  <option value="" disabled>Select Year</option>
                  {expirationYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </Form.Group>

            <Form.Group controlId="cvv" className="mt-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control type="text" placeholder="CVV" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Proceed Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
