// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap';
// import '../styles/ticket.css';

// const TicketDetails = () => {


//   const location = useLocation();
//   const { bookingData: bookedData, guestEmail } = location.state || {};

//   console.log('bookedData ;', bookedData)

//   const navigate = useNavigate();
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const departureTime = bookedData.selectedFlight.departureTime;
//   const durationMins = bookedData.selectedFlight.flight.route.durationMins;

//   const handlePrint = () => {
//     window.print();
//   };

// //   const handleConfirm = () => {
// //     navigate('/');
// //   };

//   useEffect(() => {
//     if (guestEmail) {
//       setShowEmailModal(true);
//     }
//   }, [guestEmail]);

//   const addTime = (departureTime, durationMins) => {
//     const [departureHours, departureMinutes] = departureTime.split(':').map(Number);
//     const durationHours = Math.floor(durationMins / 60);
//     const durationRemainingMinutes = durationMins % 60;

//     let totalHours = departureHours + durationHours;
//     let totalMinutes = departureMinutes + durationRemainingMinutes;

//     if (totalMinutes >= 60) {
//       totalHours += Math.floor(totalMinutes / 60);
//       totalMinutes = totalMinutes % 60;
//     }

//     totalHours = totalHours % 24;

//     const formattedHours = totalHours.toString().padStart(2, '0');
//     const formattedMinutes = totalMinutes.toString().padStart(2, '0');

//     return `${formattedHours}:${formattedMinutes}`;
//   };

//   return (
//     <div>
//       {bookedData.finalGuests.slice(0,-1).map((passenger, index) => (
//         <div key={index} className="ticket-details-container">
//           <div className="ticket-header">
//             <h2>Flight Ticket</h2>
//           </div>

//           <div className="ticket-body">
//             <div className="single-ticket">
//               <div className="ticket-row">
//                 <div className="ticket-section">
//                   <h3>Passenger</h3>
//                   <p>{passenger.firstName} {passenger.lastName}</p>
//                 </div>
//                 <div className="ticket-section">
//                   <h3>Seat</h3>
//                   <p>{passenger.seatNumber || 'Not assigned'}</p>
//                 </div>
//               </div>

//               <div className="ticket-row">
//                 <div className="ticket-section">
//                   <h3>Flight</h3>
//                   <p><strong>{bookedData.selectedFlight.flight.flightNo}</strong></p>
//                 </div>
//                 <div className="ticket-section">
//                   <h3>Gate</h3>
//                   <p>{bookedData.gateNumber || 'TBD'}</p>
//                 </div>
//               </div>

//               <div className="ticket-row">
//                 <div className="ticket-section">
//                   <h3>Departure</h3>
//                   <p>{bookedData.selectedFlight.flight.route.departure.airportCode}</p>
//                   <p>{bookedData.selectedFlight.departureTime}</p>
//                 </div>
//                 <div className="ticket-section">
//                   <h3>Arrival</h3>
//                   <p>{bookedData.selectedFlight.flight.route.destination.airportCode}</p>
//                   <p>{addTime(departureTime, durationMins)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="ticket-footer">
//             <p>Thank you for flying with us!</p>

//             <div className="ticket-actions">
//               <button className="btn btn-primary" onClick={handlePrint}>Print or Save as PDF</button>

//             </div>
//           </div>
//         </div>
//       ))}

//       <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Email Sent</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>Your ticket has been sent to your email at: <strong>{guestEmail}</strong></p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => setShowEmailModal(false)}>
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default TicketDetails;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { FaChair, FaPlaneDeparture, FaPlaneArrival, FaUser } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';
import '../styles/ticket.css';
import logo from '../images/logo.png'; // Ensure this logo matches the desired aesthetic

const TicketDetails = () => {
  const location = useLocation();
  const { bookingData: bookedData, guestEmail } = location.state || {};
  console.log(`TicketDetails`, bookedData);
  const navigate = useNavigate();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const departureTime = bookedData?.selectedFlight?.departureTime || '00:00';
  const durationMins = bookedData?.selectedFlight?.flight?.route?.durationMins || 0;

  const handlePrint = () => {
    window.print();
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

  if (!bookedData) {
    return <div className="ticket-page">No booking data available.</div>;
  }

  return (
    <div className="ticket-page">
      <div className="ticket-actions">
        <Button variant="primary" onClick={handlePrint}>Print or Save as PDF</Button>
      </div>

      {bookedData.finalGuests.slice(0, -1).map((passenger, index) => (
        <div key={index} className="ticket">
          {/* Header Section */}
          <div className="ticket-header">
            <img src={logo} alt="Logo" className="ticket-logo" />
            <h2>Boarding Pass</h2>
          </div>

          {/* Divider */}
          <hr className="divider" />

          {/* Body Section */}
          <div className="ticket-body">
            {/* Passenger Information */}
            <div className="ticket-section passenger-info">
              <h3>Passenger Details</h3>
              <p><FaUser className="icon" /> {passenger.firstName} {passenger.lastName}</p>
              <p><FaChair className="icon" /> Seat: {passenger.seatNumber || 'Not assigned'}</p>
            </div>

            {/* Flight Information */}
            <div className="ticket-section flight-info">
              <h3>Flight Details</h3>
              <p><FaPlaneDeparture className="icon" /> Flight No: {bookedData.selectedFlight.flight.flightNo}</p>
              <p>Date: {bookedData.selectedFlight.flight.flightDate}</p>
              <p>From: {bookedData.selectedFlight.flight.route.departure.airportCode}</p>
              <p>To: {bookedData.selectedFlight.flight.route.destination.airportCode}</p>
              <p><FaPlaneDeparture className="icon" /> Boarding Time: {bookedData.selectedFlight.boardingTime}</p>
              <p>Gate: {bookedData.gateNumber || 'TBD'}</p>
              <p><FaPlaneArrival className="icon" /> Arrival: {addTime(departureTime, durationMins)}</p>
            </div>

            {/* QR Code */}
            <div className="ticket-qr">
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
