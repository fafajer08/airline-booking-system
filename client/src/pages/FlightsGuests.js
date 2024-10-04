

import React, { useState, useEffect } from 'react';
import GuestDetailsForm from '../components/GuestDetailsForm';
import { BackButton, ContinueButton } from '../components/Buttons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

function GuestDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get data from location.state or localStorage
  const [data, setData] = useState(() => {
    const stateData = location.state && location.state.data;
    if (stateData) {
      // Save to localStorage
      localStorage.setItem('guestDetailsData', JSON.stringify(stateData));
      console.log('Saved stateData to localStorage:', stateData);
      return stateData;
    } else {
      // Try to retrieve from localStorage
      const localData = localStorage.getItem('guestDetailsData');
      console.log('Retrieved localData from localStorage:', localData);
      return localData ? JSON.parse(localData) : null;
    }
  });
  

  const [finalGuests, setFinalGuests] = useState(() => {
    const savedGuests = localStorage.getItem('finalGuests');
    return savedGuests ? JSON.parse(savedGuests) : [];
  });

  const [guestEmail, setGuestEmail] = useState(() => {
    return localStorage.getItem('guestEmail') || '';
  });


  const [passengerIds, setPassengerIds] = useState([]);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Extract data from the data object
  const { user, selectedFlight, promo, finalPrice:fare, selectedClass:seatClass } = data || {};

  console.log(`flight guest received user: `, user);
  console.log(`flight guest received selected flight: `, selectedFlight);
  console.log(`flight guest received promo: `, promo);

  useEffect(() => {
    // if (!data) {
    //   navigate('/flights');
    //   return;
    // }

    // If the user is not logged in, show the modal
    if (!user) {
      setShowGuestModal(true);
    }
  }, [selectedFlight, user, navigate]);

  // Save finalGuests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('finalGuests', JSON.stringify(finalGuests));
  }, [finalGuests]);

  // Save guestEmail to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('guestEmail', guestEmail);
  }, [guestEmail]);

  // Email format validation using regex
  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinueToBookingSummary = () => {
    if (!guestEmail && !user) {
      setEmailError('Please provide your email to continue as a guest.');
      return;
    }

    const bookingData = {
      user: user || null, // If user is null, use guestEmail
      selectedFlight,
      promo,
      finalGuests: finalGuests.slice(0, -1), //remove the last blank guest
      seatClass,
      fare,
    };

    console.log('sending guest email', guestEmail);

    // Clear cached data when navigating away
    //localStorage.removeItem('guestDetailsData');
    localStorage.removeItem('finalGuests');
    localStorage.removeItem('guestEmail');

    navigate('/bookings', { state: { bookingData: bookingData, guestEmail: guestEmail } });
  };

  // Close the guest modal and submit email as guest
  const handleGuestEmailSubmit = () => {
    if (!guestEmail) {
      setEmailError('Email is required to continue as a guest.');
      return;
    }

    // Validate email format
    if (!validateEmailFormat(guestEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError(''); // Clear any previous errors
    setShowGuestModal(false); // Close the modal
  };


  return (
    <div>
      <div className="container">
        <h5 className="mt-5 ms-5 px-5">Please enter your details</h5>
        <h2 className="ms-5 px-5">Guest Details</h2>
        <GuestDetailsForm setFinalGuests={setFinalGuests} />

        {/* Navigation buttons */}
        <div>
          <BackButton link="/flights/options" />
          <ContinueButton onClick={handleContinueToBookingSummary} />
        </div>

        {/* Final Guests display */}
        <div>
          <h3>Final Guests:</h3>
          <ul>
            {finalGuests.map((guest, index) => (
              <li key={index}>
                {guest.title} {guest.firstName} {guest.lastName}, {guest.day}-{guest.month}-{guest.year} ({guest.age}), {guest.nationality}, {guest.mobileNumber}, {guest.email}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for guest vs login with email input */}
      <Modal show={showGuestModal} onHide={() => setShowGuestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Booking as a Guest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You're continuing as a guest. To complete your booking, please provide your email address.
            We will send your ticket and booking details to this email.
          </p>
          <p>
            Kindly ensure your email is accurate so you can receive all necessary information regarding your trip.
          </p>

          {/* Email Input Form */}
          <Form>
            <Form.Group controlId="guestEmail">
              <Form.Label>Guest Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
              {emailError && <p style={{ color: 'red' }}>{emailError}</p>} {/* Display error if email is not valid */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleGuestEmailSubmit}>
            Continue as Guest
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GuestDetailsPage;
