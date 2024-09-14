
import React, { useState, useContext } from "react";
import Airplanes from "../components/AdminAirplaneDash";
import Airports from "../components/AdminAirportDash";
import Routes from "../components/AdminRouteDash";
import Flights from "../components/AdminFlightDash";
import { Button, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import '../styles/admincreate.css'; // Ensure the CSS file is correctly linked

export default function Admin() {
  const { user } = useContext(UserContext);

  const [activeComponent, setActiveComponent] = useState("Airplanes");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Airplanes":
        return <Airplanes />;
      case "Airports":
        return <Airports />;
      case "Routes":
        return <Routes />;
      case "Flights":
         return <Flights />;
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
              variant={activeComponent === "Airplanes" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Airplanes")}
              className="ms-2"
            >
              Airplanes
            </Button>
            <Button 
              variant={activeComponent === "Airports" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Airports")}
              className="ms-2"
            >
              Airports
            </Button>
            <Button 
              variant={activeComponent === "Routes" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Routes")}
              className="ms-2"
            >
              Routes
            </Button>
            <Button 
              variant={activeComponent === "Flights" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Flights")}
              className="ms-2"
            >
              Flights
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
