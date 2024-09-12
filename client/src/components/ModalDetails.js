import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ModalDetails({ data, isVisible, onClose }) {
  if (!data) return null;

  return (
    <Modal show={isVisible} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Flight Details - {data.flightNo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Airline:</strong> {data.airline.name}</p>
        <p><strong>Departure Airport:</strong> {data.departureAirport.name} ({data.departureAirport.code})</p>
        <p><strong>Destination Airport:</strong> {data.destinationAirport.name} ({data.destinationAirport.code})</p>
        <p><strong>Departure Date:</strong> {data.departureDate}</p>
        <p><strong>Departure Time:</strong> {data.departureTime}</p>
        <p><strong>Arrival Time:</strong> {data.arrivalTime}</p>
        <p><strong>Total Seats:</strong> {data.airline.totalSeats}</p>
        <p><strong>Booked Seats:</strong> {data.bookedSeats}</p>
        <p><strong>Status:</strong> {data.status}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
