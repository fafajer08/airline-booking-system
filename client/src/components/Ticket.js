import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import '../styles/ticket.css';

const TicketDetails = ({ guestEmail, bookedData, totalCost }) => {
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const departureTime = bookedData.commercialFlightId.departureTime;
  const durationMins = bookedData.commercialFlightId.flight.route.durationMins;

  const handlePrint = () => {
    window.print();
  };

  const handleConfirm = () => {
    navigate('/');
  };

  useEffect(() => {
    if (guestEmail) {
      setShowEmailModal(true);
    }
  }, [guestEmail]);

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

  return (
    <div>
      {bookedData.passengerIds.map((passenger, index) => (
        <div key={index} className="ticket-details-container">
          <div className="ticket-header">
            <h2>Flight Ticket</h2>
          </div>

          <div className="ticket-body">
            <div className="single-ticket">
              <div className="ticket-row">
                <div className="ticket-section">
                  <h3>Passenger</h3>
                  <p>{passenger.firstName} {passenger.lastName}</p>
                </div>
                <div className="ticket-section">
                  <h3>Seat</h3>
                  <p>{passenger.seatNumber || 'Not assigned'}</p>
                </div>
              </div>

              <div className="ticket-row">
                <div className="ticket-section">
                  <h3>Flight</h3>
                  <p><strong>{bookedData.commercialFlightId.flight.flightNo}</strong></p>
                </div>
                <div className="ticket-section">
                  <h3>Gate</h3>
                  <p>{bookedData.gateNumber || 'TBD'}</p>
                </div>
              </div>

              <div className="ticket-row">
                <div className="ticket-section">
                  <h3>Departure</h3>
                  <p>{bookedData.commercialFlightId.flight.route.departure.airportCode}</p>
                  <p>{bookedData.commercialFlightId.departureTime}</p>
                </div>
                <div className="ticket-section">
                  <h3>Arrival</h3>
                  <p>{bookedData.commercialFlightId.flight.route.destination.airportCode}</p>
                  <p>{addTime(departureTime, durationMins)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <p>Thank you for flying with us!</p>

            <div className="ticket-actions">
              <button className="btn btn-primary" onClick={handlePrint}>Print or Save as PDF</button>

            </div>
          </div>
        </div>
      ))}

      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Email Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your ticket has been sent to your email at: <strong>{guestEmail}</strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowEmailModal(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TicketDetails;
