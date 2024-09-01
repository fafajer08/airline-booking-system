import Form from 'react-bootstrap/Form';
import 'react-bootstrap';
// import '../styles/flightsearch.css';
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
  const [tripType, setTripType] = useState('oneway'); // Initialize state with 'oneway'

  const handleTripTypeChange = (event) => {
    setTripType(event.target.value);
  };

  return (
    <div>   
      <select className="flight-search-selector" value={tripType} onChange={handleTripTypeChange}>
        <option value="oneWay">ONE WAY</option>
        <option value="roundTrip">ROUND TRIP</option>
        <option value="multiCity">MULTI CITY</option>
      </select>

      {tripType === 'oneWay' && (
        <div className='d-flex flex-inline container'>
            <FlightDepartureSelector />
            <FlightDestinationSelector />
            <DepartureDateSelector />
            <PaxSelector type="ADULT" />
        </div>
      )}


      {tripType === 'roundTrip' && (
        <div className='d-flex flex-inline container'>
            <FlightDepartureSelector />
            <FlightDestinationSelector />
            <DepartureDateSelector />
            <ReturnDateSelector /> 
        </div>
      )}

      {tripType === 'multiCity' && (
        <div >
          <div className='d-flex flex-inline container'>
              <FlightDepartureSelector />
              <FlightDestinationSelector />
              <DepartureDateSelector />
              <ReturnDateSelector /> 
          </div>
          <div className='d-flex flex-inline container'>
              <FlightDepartureSelector />
              <FlightDestinationSelector />
              <DepartureDateSelector />
              <ReturnDateSelector /> 
          </div>
        </div>
      )}
    </div>
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

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

 const port = selectedPort.airportCode;
 const cityName = selectedPort.cityName;
 const airportName = truncateText(selectedPort.airportName, 30);



  return (
    <div className="port-selector-inner-container container" onClick={handlePortClick}>
      <img className="port-selector-plane-icon" src={planeUp} alt='plane icon' />
      <span className="port-selector-port-code">{port}</span>
      <img className="port-selector-division-icon" src={division} alt='division icon' />

      <div className="port-selector-city-airport-display">
        <div className="port-selector-city-display">{cityName}</div>
        <div className="port-selector-airport-display">{airportName}</div>
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
            <div className='port-select-dropdown-options'>
              <div className="port-selector-dropdown-city">{flight.cityName} - {flight.airportName}</div>
            </div>
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
    <div className="return-date port-selector-outer-container container">
      <p>DESTINATION AIRPORT</p>
      <div>
        <PortSelector />
      </div>
    </div>
  );

}

function FlightSelector() {
  return (
    <div className='d-flex flex-inline container'>
      <FlightDepartureSelector />
      <FlightDestinationSelector />
      <DepartureDateSelector />
      <ReturnDateSelector /> 
    </div>
  );
}

function PaxSelector({ type }) { // Accepts type as a prop
  const [paxCount, setPaxCount] = useState(1); // Initialize with 1 passenger
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handlePaxClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePaxSelect = (pax) => {
    setPaxCount(pax);
    setIsDropdownOpen(false);
  };

  const paxOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const typeLabel = {
    ADULT: '(12+ YEARS)',
    CHILD: '(2-11 YEARS)',
    INFANT: '(UNDER 2 YEARS)',
  }[type] || 'Passengers';

  return (
    <div className="pax-selector-outer-container">
    <div className="pax-selector-inner-container container" onClick={handlePaxClick}>
      <span className="pax-selector-label">{type} <span className="type-label">{typeLabel}</span> </span> 
      <div className="pax-selector-count">{paxCount}</div>
      <img
        className="pax-selector-dropdown-icon"
        src={dropDownIcon}
        alt="dropdown icon"
      />

      {isDropdownOpen && (
        <div className="pax-selector-dropdown" ref={dropdownRef}>
          {paxOptions.map((pax, index) => (
            <div
              key={index}
              className="pax-selector-dropdown-item"
              onClick={() => handlePaxSelect(pax)}
            >
              {pax}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}



export default FlightSelector;
export { FlightSearchSelector, DateSelector, DepartureDateSelector, ReturnDateSelector, PortSelector, FlightDepartureSelector, FlightDestinationSelector };
