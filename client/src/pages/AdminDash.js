import React, { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import '../styles/admin.css';  // Import the CSS file
import Flights from "../components/AdminFlightsDash";
import Bookings from "../components/AdminBookingsDash";
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';

export default function Admin() {
  const { user } = useContext(UserContext); // Correct useContext to access user

  return (
    <div>
      <div className="d-flex align-content-center justify-content-center">
        <div className="container ">

          <h5 className="mt-5 ms-5 px-5">Flights Dashboard</h5>
          {user ? ( // Check if user exists to avoid errors
            <h2 className="ms-5 px-5">Welcome {user.firstName}</h2>
          ) : (
            <h2 className="ms-5 px-5">Welcome Guest</h2>
          )}

          <div className="d-flex align-content-center justify-content-center">
            <Flights />
          </div>

          <div className="d-flex align-content-center justify-content-center">
            <Bookings />
          </div>
        </div>
      </div>
    </div>
  );
}
