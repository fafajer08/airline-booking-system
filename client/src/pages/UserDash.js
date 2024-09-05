import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import '../styles/admin.css';  // Import the CSS file
import Flights from "../components/AdminFlightsDash";
import Bookings from "../components/AdminBookingsDash";
import { Container, Col, Row, Button, Form} from 'react-bootstrap'

export default function Users() {
  return (
      <div>
        <div className="d-flex align-content-center justify-content-center">
          <div className="container ">

              <h5 className="mt-5 ms-5 px-5">My Bookings</h5>
              <h2 className="ms-5 px-5">Welcome User</h2>

              <div className="d-flex align-content-center justify-content-center">

          
              </div>
              <div className="d-flex align-content-center justify-content-center">

            </div>
          </div>
        </div>
      </div>
    );
  }


