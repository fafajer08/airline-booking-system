// import React, { useState, useContext } from "react";
// import CreateFlight from "../components/AdminCreateFlightDash";
// import Airplane from "../components/AdminAirplaneDash";
// import Airport from "../components/AdminAirportDash";
// import Route from "../components/AdminRouteDash";
// import { Button, Row, Col } from 'react-bootstrap';
// import UserContext from '../context/UserContext';

// export default function Admin() {
//   const { user } = useContext(UserContext);
  
//   const [activeComponent, setActiveComponent] = useState("Airport");

//   const renderActiveComponent = () => {
//     switch (activeComponent) {
//       case "CreateFlight":
//         return <CreateFlight />;
//       case "Airplane":
//         return <Airplane />;
//       case "Airport":
//         return <Airport />;
//       case "Route":
//         return <Route />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="admin-dashboard-container">
//       <div className="admin-dashboard-wrapper">
//         <Row className="admin-dashboard-header mt-5 align-items-center">
//           <Col md={9}>
//             <h5 className="admin-dashboard-title">Admin Dashboard</h5>
//             {user ? (
//               <h2 className="admin-dashboard-greeting">Welcome {user.firstName}</h2>
//             ) : (
//               <h2 className="admin-dashboard-greeting">Welcome Guest</h2>
//             )}
//           </Col>

//           {/* Button Row */}
//           <Col md={3} className="admin-dashboard-button-row d-flex justify-content-end">
//             <Button
//               className={`ms-2 admin-dashboard-btn ${activeComponent === "CreateFlight" ? "admin-dashboard-btn-primary" : ""}`}
//               onClick={() => setActiveComponent("CreateFlight")}
//             >
//               CreateFlight
//             </Button>
//             <Button
//               className={`ms-2 admin-dashboard-btn ${activeComponent === "Airplane" ? "admin-dashboard-btn-primary" : ""}`}
//               onClick={() => setActiveComponent("Airplane")}
//             >
//               Airplane
//             </Button>
//             <Button
//               className={`ms-2 admin-dashboard-btn ${activeComponent === "Airport" ? "admin-dashboard-btn-primary" : ""}`}
//               onClick={() => setActiveComponent("Airport")}
//             >
//               Airport
//             </Button>
//             <Button
//               className={`ms-2 admin-dashboard-btn ${activeComponent === "Route" ? "admin-dashboard-btn-primary" : ""}`}
//               onClick={() => setActiveComponent("Route")}
//             >
//               Route
//             </Button>
//           </Col>
//         </Row>

//         {/* Render the active component */}
//         <div className="admin-dashboard-content d-flex align-content-center justify-content-center mt-4">
//           {renderActiveComponent()}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useContext } from "react";
import Airplanes from "../components/AdminAirplaneDash";
import Airports from "../components/AdminAirportDash";
import Routes from "../components/AdminRouteDash";
// import CreateFlights from "../components/AdminCreateFlightsDash";
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
      case "Create Flights":
        // return <CreateFlights />;
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
              variant={activeComponent === "Create Flights" ? "primary" : "outline-primary"} 
              onClick={() => setActiveComponent("Create Flights")}
              className="ms-2"
            >
              Create Flights
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
