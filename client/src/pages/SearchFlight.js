
import { Button, Row, Col } from "react-bootstrap";
import FlightSearchSelector from "../components/SearchFlight.js";
import NavBar from "../components/NavBar";
import { DateSelector } from "../components/SearchFlight.js";




export default function SearchFlight() {
  return (
    <div>
      <NavBar />
      <div className='container'>
          
          <h1 className="my-5">Where would you like to go? </h1>
          <form>
          <div className="">
            <FlightSearchSelector />
          </div>
          </form>
      </div>
    </div>
  );
}