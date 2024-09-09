import React, { useState, useContext } from "react";
// import CreateFlight from "../components/AdminCreateFlightDash";
// import Airplane from "../components/AdminAirplaneDash";
import Airport from "../components/AdminAirportDash";  
// import Route from "../components/AdminRouteDash";  
import { Button, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import '../styles/admincreate.css'; // Ensure the CSS file is correctly linked

export default function Admin() {
  const { user } = useContext(UserContext);
  
  const [activeComponent, setActiveComponent] = useState("CreateFlight");

  const renderActiveComponent = () => {
    switch (activeComponent) {
    //   case "CreateFlight":
    //     return <CreateFlight />;
    //   case "Airplane":
        // return <Airplane />;
      case "Airport":
        return <Airport />;
      // case "Route":
      //   return <Route />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-wrapper">
        <Row className="admin-dashboard-header mt-5 align-items-center">
          <Col md={9}>
            <h5 className="admin-dashboard-title">Admin Dashboard</h5>
            {user ? (
              <h2 className="admin-dashboard-greeting">Welcome {user.firstName}</h2>
            ) : (
              <h2 className="admin-dashboard-greeting">Welcome Guest</h2>
            )}
          </Col>

          {/* Button Row */}
          <Col md={3} className="admin-dashboard-button-row d-flex justify-content-end">
            {/* <Button 
              variant={activeComponent === "CreateFlight" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("CreateFlight")}
              className="ms-2 admin-dashboard-btn"
            >
              CreateFlight
            </Button>
            <Button 
              variant={activeComponent === "Airplane" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Airplane")}
              className="ms-2 admin-dashboard-btn"
            >
              Airplane
            </Button> */}
            <Button 
              variant={activeComponent === "Airport" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Airport")}
              className="ms-2 admin-dashboard-btn"
            >
              Airport
            </Button>
            {/* <Button 
              variant={activeComponent === "Route" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Route")}
              className="ms-2 admin-dashboard-btn"
            >
              Route
            </Button> */}
          </Col>
        </Row>

        {/* Render the active component */}
        <div className="admin-dashboard-content d-flex align-content-center justify-content-center mt-4">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}
