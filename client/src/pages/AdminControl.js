
import React, { useState, useContext } from "react";
import Airplanes from "../components/AdminAirplaneDash";
import Users from "../components/AdminUsersDash";
import Bookings from "../components/AdminRouteDash";
import Passengers from "../components/AdminPassengersDash";
import { Button, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import '../styles/admindash.css'; // Ensure the CSS file is correctly linked

export default function Admin() {
  const { user } = useContext(UserContext);

  const [activeComponent, setActiveComponent] = useState("Airplanes");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Airplanes":
        //return <Airplanes />;
      case "Users":
        return <Users />;
      case "Bookings":
        //return <Bookings />;
      case "Passengers":
         return <Passengers />;
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
            {/* <Button 
              variant={activeComponent === "Airplanes" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Airplanes")}
              className="ms-2"
            >
              Airplanes
            </Button> */}

            <Button 
              variant={activeComponent === "Bookings" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Bookings")}
              className="ms-2"
            >
              Bookings
            </Button>
            <Button 
              variant={activeComponent === "Passengers" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Passengers")}
              className="ms-2"
            >
              Passengers
            </Button>
            <Button 
              variant={activeComponent === "Users" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Users")}
              className="ms-2"
            >
              Users
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
