import React, { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import '../styles/admin.css';  // Import the CSS file
import Flights from "../components/AdminFlightsDash";
import Bookings from "../components/AdminBookingsDash";
import { Container, Col, Row, Button, Form} from 'react-bootstrap'
import UserContext from "../context/UserContext";

export default function Users() {

  const { user } = useContext(UserContext);




  return (
      <div>
        <div className="d-flex align-content-center justify-content-center">
          <div className="container ">

              <h5 className="mt-5 ms-5 px-5">My Bookings</h5>
              <h2 className="ms-5 px-5">Welcome {user.firstName || 'Guest'}</h2>

              <div className="d-flex align-content-center justify-content-center">

          
              </div>
              <div className="d-flex align-content-center justify-content-center">

            </div>
          </div>
        </div>
      </div>
    );
  }


