
import { Button, Row, Col } from "react-bootstrap";
import FlightSearchSelector from "../components/SearchFlight.js";
import NavBar from "../components/NavBar";
import { DateSelector } from "../components/SearchFlight.js";




export default function SearchFlight() {
  return (
    <div>
      <NavBar />
      <div className=''>
          
          <h1>Where would you like to go? </h1>
          <form>
          <div className="">
          <DateSelector label="DEPARTURE DATE" />
            <FlightSearchSelector />
          </div>
          </form>
      </div>
    </div>
  );
}