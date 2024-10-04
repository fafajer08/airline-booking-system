

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaChair, FaPlaneDeparture, FaPlaneArrival, FaUser, FaTicketAlt } from 'react-icons/fa';
import QRCode from 'react-qr-code'; // For QR Code generation
import '../styles/ticket.css'; // Enhanced styling
import logo from '../images/logo.png'; 

const TicketDetails = ({ guestEmail, bookedData }) => {
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  const departureTime = bookedData.selectedFlight.departureTime;
  const durationMins = bookedData.selectedFlight.flight.route.durationMins;

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Show the email modal if guestEmail is provided
  useEffect(() => {
    if (guestEmail) {
      setShowEmailModal(true);
    }
  }, [guestEmail]);

  /**
   * Function to add duration to departure time.
   * @param {string} departureTime - Format 'HH:MM'
   * @param {number} durationMins - Duration in minutes
   * @returns {string} - Arrival time in 'HH:MM' format
   */
  const addTime = (departureTime, durationMins) => {
    const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
    const durationHours = Math.floor(durationMins / 60);
    const durationRemainingMinutes = durationMins % 60;

    let totalHours = departureHours + durationHours;
    let totalMinutes = departureMinutes + durationRemainingMinutes;

    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
    }

    totalHours = totalHours % 24;

    const formattedHours = totalHours.toString().padStart(2, '0');
    const formattedMinutes = totalMinutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  };

  /**
   * Mapping of seat class codes to user-friendly labels.
   */
  const SEAT_CLASS_MAP = {
    economySeat: 'Economy Class',
    premiumSeat: 'Premium Class',
    businessSeat: 'Business Class',
    firstClass: 'First Class',
  };

  /**
   * Function to save 'fare' to localStorage.
   * @param {string} fare - The final price to save.
   */
  const saveFareToLocalStorage = (fare) => {
    if (fare) {
      localStorage.setItem('fare', fare);
      console.log(`Fare saved to localStorage: PHP ${fare}`);
    }
  };

  // Compute and save 'fare' when bookedData.finalPrice changes
  useEffect(() => {
    if (bookedData.finalPrice) {
      saveFareToLocalStorage(bookedData.finalPrice);
    }
  }, [bookedData.finalPrice]);

  return (
    <div className="ticket-page">
      <div className="ticket-actions">
        <Button variant="primary" onClick={handlePrint}>
          <FaTicketAlt className="me-2" />
          Print or Save as PDF
        </Button>
      </div>

      {bookedData.finalGuests.slice(0, -1).map((passenger, index) => (
        <div key={index} className="ticket">
          {/* Header Section */}
          <div className="ticket-header">
            <img src={logo} alt="Logo" className="ticket-logo" />
            <h2>FLy Air Passenger Ticket</h2>
          </div>

          {/* Divider */}
          <hr className="divider" />

          {/* Body Section */}
          <div className="ticket-body">
            {/* Passenger Information */}
            <div className="ticket-section passenger-info">
              <div>
                <h3>Ticket Information</h3>
                <p>Ticket No.</p>
              </div>
              <br></br>
             <div>
                <h3>Passenger Details</h3>
                <p>
                  <FaUser className="icon" /> {passenger.firstName} {passenger.lastName}
                </p>
                <p>
                  <FaChair className="icon" /> Seat: {passenger.seatNumber || 'Not assigned'}
                </p>
                {/* Display Seat Class */}
                <p>
                  <FaTicketAlt className="icon" /> Class: {SEAT_CLASS_MAP[bookedData.seatClass] || 'Economy Class'}
                </p>
              </div>
            </div>

            {/* Flight Information */}
            <div className="ticket-section flight-info">
              <h3>Flight Details</h3>
              <p>
                <FaPlaneDeparture className="icon" /> Flight No: {bookedData.selectedFlight.flight.flightNo}
              </p>
              <p>Date: {bookedData.selectedFlight.date}</p>
              <p>From: {bookedData.selectedFlight.flight.route.departure.airportCode}</p>
              <p>To: {bookedData.selectedFlight.flight.route.destination.airportCode}</p>
              <p>
                <FaPlaneDeparture className="icon" /> Boarding Time: {bookedData.selectedFlight.departureTime}
              </p>
              <p>Gate: {bookedData.gateNumber || 'TBD'}</p>
              <p>
                <FaPlaneArrival className="icon" /> Arrival: {addTime(departureTime, durationMins)}
              </p>
              {/* Display Fare */}
              {/* <p>
                <FaChair className="icon" /> Fare: PHP {bookedData.finalPrice}
              </p> */}
            </div>

            {/* QR Code */}
            <div className="ticket-qr">
            Scan code to check-in.
              <QRCode
                value={`https://airline.com/boarding-pass/${bookedData.selectedFlight.flight.flightNo}`}
                size={80}
                bgColor="#FFFFFF" // White background
                fgColor="#000000" // Black QR code
              />
            </div>
          </div>

          {/* Footer Section */}
          <div className="ticket-footer">
            <p>Thank you for flying with us! Safe travels.</p>
          </div>
        </div>
      ))}

      {/* Email Modal */}
      {showEmailModal && (
        <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Booking Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            A confirmation email has been sent to {guestEmail}.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default TicketDetails;
