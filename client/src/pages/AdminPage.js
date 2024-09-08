import React, { useState, useContext } from "react";
import Destinations from "../components/AdminDestinationsDash";
import Deals from "../components/AdminDealsDash";
import { Button, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import '../styles/admindash.css'; // Ensure the CSS file is correctly linked

export default function Admin() {
  const { user } = useContext(UserContext);

  const [activeComponent, setActiveComponent] = useState("Destinations");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Destinations":
        return <Destinations />;
      case "Deals":
        return <Deals />;
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
          <Col md={3} className="d-flex justify-content-end button-row">
            <Button 
              variant={activeComponent === "Destinations" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Destinations")}
              className="ms-2"
            >
              Destinations
            </Button>
            <Button 
              variant={activeComponent === "Deals" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Deals")}
              className="ms-2"
            >
              Deals
            </Button>
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
