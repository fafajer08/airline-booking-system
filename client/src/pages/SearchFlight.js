// import Banner from "../components/Banner";
// import Highlights from "../components/Highlights";
// import Course from "../components/Course"
import { Button, Row, Col } from "react-bootstrap";
// import FlightSelector, { FlightSearchSelector,DateSelector, DepartureDateSelector, ReturnDateSelector, PortSelector, FlightDepartureSelector, FlightDestinationSelector } from "../components/FlightSearch";
import FlightSearchSelector from "../components/FlightSearch2";
import NavBar from "../components/NavBar";




export default function SearchFlight() {
  return (
    <div>
      <NavBar />
      <div class='container fluid'>
          
          <h1>Where would you like to go? </h1>
          <div>
            <FlightSearchSelector />

          </div>
      </div>
    </div>
  );
}