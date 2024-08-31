import Form from 'react-bootstrap/Form';
import 'react-bootstrap';
import '../styles/flightsearch.css';
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import planeUp from '../assets/planeup.png';
import division from '../assets/division.png';
import swapIcon from '../assets/swapicon.png';
import dropDownIcon from '../assets/dropdowngray.png';
import calendar from '../assets/calendar.png';

function FlightSearchSelector() {
  return (
  <select className="flight-search-selector">
      <option value="oneway">ONE WAY</option>
      <option value="roundTrip">ROUND TRIP</option>
      <option value="multiCity">MULTI-CITY</option>
  </select>
  );
}

const Example = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
  );
};


function PortSelector() {
  return (
    <select className="port-selector">
      <option value="dvo">Davao</option>
    </select>
  );
}



function DepartureSearchSelector() {
  return (
  <div className="flight-search d-flex">
    <div className="departure-search airport-select box"> 
      <p>DEPARTURE AIRPORT</p>
      <div className = "d-flex">
          <img className="plane-icon" src={planeUp} alt="plane departing" />
            <div className="departure-port-code">DVO</div>
          <img src={division} alt="division icon" />
          <div>
            <PortSelector />
            {Example()};
          </div>
      </div>
      <img src={dropDownIcon} alt="dropdown icon" />
    </div>

    <div>
      <img className="swap-icon" src={swapIcon} alt="swap departure and arrival locations" />
    </div>



    <div className="return-search airport-select box">
    <p>ARRIVAL AIRPORT</p>
      MNL
    </div>


    <div className="departure-date box">
      <p>DEPARTURE DATE</p>
      25
        <img src={dropDownIcon} alt="dropdown icon" />
      </div>
  </div>
  );
}


// function FlightSearchSelector() {
//   return (
//     <Form.Select aria-label="Default select example" className='w-25 mx-auto'>
//       {/* <option>Open this select menu</option> */}
//       <option value="oneway">ONE WAY</option>
//       <option value="roundTrip">ROUND TRIP</option>
//       <option value="multiCity">MULTI-CITY</option>
//     </Form.Select>
//   );
// }



// function DepartureSearchSelector() {
//   return (
//   <div className>
//     <div className="departure-search"> 
//     search bar </div>
//     <div className="return-search">  </div>
//     <div className="departure-date"> </div>
//   </div>
//   );
// }


export default FlightSearchSelector;
export { DepartureSearchSelector };