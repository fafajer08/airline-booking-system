import React, { useState, useEffect } from 'react';
import { BackButton, SubmitButton } from '../components/Buttons';
import { Modal, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Ticket from '../components/Ticket'; // Import TicketDetails

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate hook to navigate between routes
  const { bookedData, guestEmail } = location.state;
  const [showModal, setShowModal] = useState(false); // State to handle credit card modal visibility
  const [showTicket, setShowTicket] = useState(false); // State to handle showing ticket instead of modal
  const [paymentMethod, setPaymentMethod] = useState(''); // State to track the selected payment method
  const [expiryMonth, setExpiryMonth] = useState(''); // State for expiration month
  const [expiryYear, setExpiryYear] = useState(''); // State for expiration year
  const [isProcessing, setIsProcessing] = useState(false); // Track payment processing state

  //console.log('bookedData', bookedData);
  const bookingId = bookedData._id;

  // Handle opening and closing of the credit card modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Save `bookedData` to localStorage
  useEffect(() => {
    if (bookedData) {
      console.log('Saving bookedData to localStorage'); // Debugging bookedData saving
      localStorage.setItem('bookedData', JSON.stringify(bookedData)); // Save to localStorage
    } else {
      navigate('/flights'); // Redirect to flights if no bookedData found
    }
  }, [bookedData, navigate]);

  // Handle the radio button change for payment methods
  const handlePaymentChange = (e) => {
    console.log(`Selected payment method: ${e.target.value}`); // Debugging payment method
    setPaymentMethod(e.target.value);
    if (e.target.value === 'creditCard') {
      handleShowModal(); // Show the modal when Credit Card is selected
    }
  };

  const currentYear = new Date().getFullYear();
  const expirationYears = Array.from(new Array(15), (val, index) => currentYear + index); // Generate next 15 years

  // 1. Simulate payment request
  const redirectToPaymentLink = async () => {
    console.log(`Redirecting to payment link for: ${paymentMethod}`); // Debugging redirect
    if (paymentMethod) {
      // Simulate redirect to external payment provider (e.g., Credit Card, PayPal, etc.)
      return Promise.resolve({ status: 200, success: true }); // Placeholder for actual redirection
    }
    throw new Error('Please select a payment method.');
  };

  // 2. Simulate successful payment
  const simulatePaymentSuccess = async () => {
    console.log('Simulating payment success...'); // Debugging payment simulation
    const response = await redirectToPaymentLink();
    console.log('Payment simulation response:', response); // Log the response
    if (response.status === 200 && response.success) {
      return Promise.resolve(true);
    }
    throw new Error('Payment failed.');
  };

  // 3. Save payment to database
  const savePayment = async () => {
    const paymentPayload = {
      bookingId,
      seatClass: bookedData.seatClass,
      noPassenger: bookedData.passengerIds.length,
      paymentMethod,
      amount: bookedData.fare,
    };

    console.log('Saving payment with payload:', paymentPayload); // Debugging payload

    const response = await fetch(`${process.env.REACT_APP_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const paymentData = await response.json();
    console.log('Payment save response:', paymentData); // Debugging payment save response

    if (!response.ok) {
      const error = await response.json();
      console.error('Error saving payment:', error.message); // Log error if any
      throw new Error(error.message);
    }
    return paymentData; // Return saved payment data
  };

  // 4. Update booking with payment ID
  const updateBookingWithPaymentId = async (paymentId) => {
    console.log(`Updating booking ID: ${bookingId} with payment ID: ${paymentId}`); // Debugging booking update

    const response = await fetch(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}/updatepayment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ paymentId }),
    });

    const updatedBooking = await response.json();
    console.log('Booking update response:', updatedBooking); // Debugging booking update response

    if (!response.ok) {
      const error = await response.json();
      console.error('Error updating booking:', error.message); // Log error if any
      throw new Error(error.message);
    }
    return updatedBooking.paymentId; // Return updated booking
  };

  // 5. Update flight with booking ID and seat availability
  const updateFlightWithBooking = async () => {
    
    const seatClass = bookedData.seatClass;
    const noPassenger = bookedData.passengerIds.length;

    console.log('Updating flight with new booking and available seats:', bookingId, seatClass,noPassenger); // Debugging flight update

    const response = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/${bookedData.commercialFlightId._id}/addbooking`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({bookingId, seatClass, noPassenger})
    });

    const updatedFlight = await response.json();
    console.log('Flight update response:', updatedFlight); // Debugging flight update response

    if (!response.ok) {
      const error = await response.json();
      console.error('Error updating flight:', error.message); // Log error if any
      throw new Error(error.message);
    }
    return updatedFlight; // Return updated flight
  };

  // Main function to handle the entire payment process
  const handlePaymentRequest = async () => {
    try {
      console.log('Initiating payment process...'); // Debugging start of payment process
      setIsProcessing(true);

      await simulatePaymentSuccess(); // Simulate a successful payment
      console.log('Payment successful'); // Log successful payment

      const paymentData = await savePayment(); // Save payment details
      console.log('Payment saved, data:', paymentData); // Log saved payment data

      await updateBookingWithPaymentId(paymentData._id); // Update booking with payment ID
      console.log('Booking updated with payment ID'); // Log booking update

      await updateFlightWithBooking(); // Update the flight with booking ID and seats
      console.log('Flight updated with booking'); // Log flight update

      // setShowTicket(true); // Show ticket on successful completion

      navigate('/ticket', { state: { bookedData, guestEmail } });
      
    } catch (error) {
      console.error('Error during payment process:', error.message); // Log any errors during process
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {!showTicket ? (
        <div className="container">
          <h5>How would you like to pay?</h5>
          <h2>Payment Method</h2>
          <div className='px-5 py-3'>
            {/* Payment method selection */}
            <div>
              <h3>Credit or Debit Card</h3>
              <input type="radio" name="paymentMethod" value="creditCard" onChange={handlePaymentChange} />
              <label className='px-5 py-3'>Credit, Debit, or Prepaid Cards</label>
            </div>
            <div>
              <h3>E-Wallet</h3>
              <input type="radio" name="paymentMethod" value="alipay" onChange={handlePaymentChange} />
              <label className='px-5 py-3'>Alipay</label>
            </div>
            <div>
              <input type="radio" name="paymentMethod" value="applepay" onChange={handlePaymentChange} />
              <label className='px-5 py-3'>Apple Pay</label>
            </div>
            <div>
              <input type="radio" name="paymentMethod" value="googlepay" onChange={handlePaymentChange} />
              <label className='px-5 py-3'>Google Pay</label>
            </div>
            <div>
              <input type="radio" name="paymentMethod" value="paypal" onChange={handlePaymentChange} />
              <label className='px-5 py-3'>PayPal</label>
            </div>
          </div>

          <div>
            <p>By clicking the ‘Continue’ button below, I confirm that I have read, understood, and accept all the conditions set by the airline.</p>
          </div>

          <div className='d-flex'>
            <div className='ms-auto'>
              <BackButton link="/bookings" />
              <SubmitButton onClick={handlePaymentRequest} disabled={isProcessing} />
            </div>
          </div>
        </div>
      ) : (
        <Ticket guestEmail={guestEmail} bookedData={bookedData} />
      )}

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
