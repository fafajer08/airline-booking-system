import Form from 'react-bootstrap/Form';
import 'react-bootstrap';
import '../styles/flightsearch.css';
import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col } from "react-bootstrap";

// import images
import planeUp from '../assets/planeup.png';
import division from '../assets/division.png';
import swapIcon from '../assets/swapicon.png';
import dropDownIcon from '../assets/dropdown.png';
import calendar from '../assets/calendar.png';


const flights = [
  {
    cityName: 'Davao', 
    airportCode: 'DVO',
    airportName: 'Francisco Bangoy International Airport'
  },
  {
    cityName: 'Manila', 
    airportCode: 'MNL',
    airportName: 'NAIA International Airport'
  }
];



// One way / round trip / multi city picker
function FlightSearchSelector() {
  return (
    <select className="flight-search-selector">
      <option value="oneway">ONE WAY</option>
      <option value="roundTrip">ROUND TRIP</option>
      <option value="multiCity">MULTI-CITY</option>
    </select>
  );
}

// date selector 
function DateSelector() {
  const [startDate, setStartDate] = useState(new Date());
  const datePickerRef = useRef(null); // Use a ref to control the DatePicker

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true); // Open the calendar when the icon is clicked
    }
  };

  const handleDateChange = (selectedDate) => {
    setStartDate(selectedDate);
  };

  const day = startDate.toLocaleString('en-US', { weekday: 'short' }); // 3-char day abbreviation
  const month = startDate.toLocaleString('en-US', { month: 'short' }); // 3-char month abbreviation
  const date = startDate.getDate(); // Day of the month
  const year = startDate.getFullYear().toString().slice(-2); // Last 2 digits of the year

  return (
    <div className="date-selector-inner-container container" onClick={handleIconClick} >

      <img className="date-selector-calendar-icon" src={calendar} alt='calendar icon' />
      <span className="date-selector-date-display">{date}</span>
      <img className="date-selector-division-icon" src={division} alt='divisions icon' />
  

      <div className="date-selector-day-month-display">
        <div className="date-selector-day-display">{day}</div>
        <div className="date-selector-mmmyy-display">{month}'{year}</div>
      </div>

      <img 
        className="date-selector-dropdown-icon"
        src={dropDownIcon} 
        alt="dropdown icon" 
        // onClick={handleIconClick} 
        // style={{ cursor: 'pointer' }} // Make the icon clickable
      />

      <DatePicker
        ref={datePickerRef}
        selected={startDate}
        onChange={handleDateChange}
        className="date-selector-hidden-datepicker date-picker" // Hide the default input if needed
        onClickOutside={() => datePickerRef.current.setOpen(false)} // Close calendar when clicking outside
      />
    </div>
  );
}

function DepartureDateSelector() {
  return (
    <div className="departure-date date-selector-outer-container container">
      <p >DEPARTURE DATE</p>
      <div>
        <DateSelector />
      </div>
    </div>
  );
}

function ReturnDateSelector() {
  return (
    <div className="return-date date-selector-outer-container container">
      <p classname="label">RETURN DATE</p>
      <div>
        <DateSelector />
      </div>
    </div>
  );
}


// function PortSelector() {

//   return (
//     <div>
//       <select className="port-selector">
//         {flights.map((flight, index) => (
//           <option key={index} value={flight.airportCode.toLowerCase()}>
//             {flight.cityName} ({flight.airportCode})
//           </option>
//         ))}
//       </select>



//     </div>
//   );
// }

function PortSelector() {
  const [selectedPort, setSelectedPort] = useState({
    cityName: 'Davao',
    airportCode: 'DVO',
    airportName: 'Francisco Bangoy International Airport',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handlePortClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePortSelect = (flight) => {
    setSelectedPort(flight);
    setIsDropdownOpen(false);
  };


  

  return (
    <div className="port-selector-inner-container container" onClick={handlePortClick}>
      <img className="port-selector-plane-icon" src={planeUp} alt='plane icon' />
      <span className="port-selector-port-code">{selectedPort.airportCode}</span>
      <img className="port-selector-division-icon" src={division} alt='division icon' />

      <div className="port-selector-city-airport-display">
        <div className="port-selector-city-display">{selectedPort.cityName}</div>
        <div className="port-selector-airport-display">{selectedPort.airportName}</div>
      </div>

      <img
        className="port-selector-dropdown-icon"
        src={dropDownIcon}
        alt="dropdown icon"
        // style={{ cursor: 'pointer' }} // Optionally, make the icon clickable
      />

      {isDropdownOpen && (
        <div className="port-selector-dropdown" ref={dropdownRef}>
          {flights.map((flight, index) => (
            <div
              key={index}
              className="port-selector-dropdown-item"
              onClick={() => handlePortSelect(flight)}
            >
              {flight.cityName} ({flight.airportCode})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





function FlightDepartureSelector() {
  return (
    <div className="return-date port-selector-outer-container container">
      <p>DEPARTURE AIRPORT</p>
      <div>

        <PortSelector />
      </div>
    </div>
  );
}

function FlightDestinationSelector() {
  return (
    <div className="return-date flight-selector-outer-container">
      <p>DESTINATION AIRPORT</p>
      <div>
        <PortSelector />
      </div>
    </div>
  );

}

function FlightSelector() {
  return (
    <div className='flight-search-selector d-flex flex-inline container'>
      <FlightDepartureSelector />
      {/* <FlightDestinationSelector /> */}
      <DepartureDateSelector />
      {/* <ReturnDateSelector /> */}
    </div>
  );
}

export default FlightSelector;
export { FlightSearchSelector, DateSelector, DepartureDateSelector, ReturnDateSelector, PortSelector, FlightDepartureSelector, FlightDestinationSelector };
