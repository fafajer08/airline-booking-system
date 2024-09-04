import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import '../styles/admin.css';  // Import the CSS file
import Flights from "../components/AdminFlightsDash";
import Bookings from "../components/AdminBookingsDash";

export default function Admin() {
  return (
      <div>
        <NavBar />
        <div className="d-flex align-content-center justify-content-center">
          <div className="container ">
            <h5 className="mt-5 ms-5 px-5">Flights Dashboard</h5>
            <h2 className="ms-5 px-5">Welcome Admin</h2>

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


