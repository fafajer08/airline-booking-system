// import Banner from "../components/Banner";
// import Highlights from "../components/Highlights";
// import Course from "../components/Course"
import FlightSearchSelector from "../components/FlightSearch";
import { Button, Row, Col } from "react-bootstrap";
import { DepartureSearchSelector } from "../components/FlightSearch";
import NavBar from "../components/NavBar";

export default function SearchFlight() {
  return (
    <div>
      <NavBar />
      <div class='container fluid'>
          
          <h1>Where would you like to go? </h1>
          <FlightSearchSelector />
          <DepartureSearchSelector />
      </div>
    </div>
  );
}