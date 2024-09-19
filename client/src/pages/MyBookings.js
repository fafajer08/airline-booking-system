import React, { useState, useContext } from "react";
import Destinations from "../components/AdminDestinationsDash";
import Deals from "../components/AdminDealsDash";
import Promo from "../components/PromoDash";
import MyBookingsDash from "../components/MyBookingsDash";
import { Button, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import '../styles/admindash.css'; // Ensure the CSS file is correctly linked

export default function Admin() {
  const { user } = useContext(UserContext);

  const [activeComponent, setActiveComponent] = useState("All Bookings");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "All Bookings":
        return <MyBookingsDash />;
      case "Deals":
        return <Deals />;
      case "Promo":
        return <Promo />;
      
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <Row className="mt-5 align-items-center">
          <Col md={9}>
            <h5>Admin Dashboard</h5>
            {user ? (
              <h2>Welcome {user.firstName}</h2>
            ) : (
              <h2>Welcome Guest</h2>
            )}
          </Col>

          {/* Button Row */}
          <Col md={3} className="d-flex justify-content-end admin-page-button-row">
            <Button 
              variant={activeComponent === "All Bookings" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("All Bookings")}
              className="ms-2"
            >
              Bookings
            </Button>
            {/* <Button 
              variant={activeComponent === "Deals" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Deals")}
              className="ms-2"
            >
              Deals
            </Button>
            <Button 
              variant={activeComponent === "Promo" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Promo")}
              className="ms-2"
            >
              Promo
            </Button> */ }
          </Col>
        </Row>

        {/* Render the active component */}
        <div className="d-flex align-content-center justify-content-center mt-4">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}
