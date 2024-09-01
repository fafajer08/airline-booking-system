import React, { useState, useRef, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col } from "react-bootstrap";
import planeUp from '../assets/planeup.png';
import planeDown from '../assets/planedown.png';
import division from '../assets/division.png';
import dropDownIcon from '../assets/dropdown.png';
import calendar from '../assets/calendar.png';
import swapIcon from '../assets/swapicon.png';
import '../styles/flightsearch2.css';

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

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { isOpen, toggleDropdown, dropdownRef };
}




// One way / round trip / multi city picker
function FlightSearchSelector() {
  const [tripType, setTripType] = useState('oneWay'); // Initialize state with 'oneWay'

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
        <div className='d-flex flex-inline align-items-center'>
            <FlightDepartureSelector label="DEPARTURE AIRPORT" />
            <SwapIcon />
            <FlightDestinationSelector label="DESTINATION AIRPORT" />
            <DateSelector label="DEPARTURE DATE" />
            <PaxSelector type="ADULT" />
        </div>
      )}

      {tripType === 'roundTrip' && (
        <div className='d-flex flex-inline'>
            <FlightDepartureSelector label="DEPARTURE AIRPORT" />
            <FlightDestinationSelector label="DESTINATION AIRPORT" />
            <DateSelector label="DEPARTURE DATE" />
            <DateSelector label="RETURN DATE" /> 
        </div>
      )}

      {tripType === 'multiCity' && (
        <div>
          <div className='d-flex flex-inline'>
              <FlightDepartureSelector label="DEPARTURE AIRPORT" />
              <FlightDestinationSelector label="DESTINATION AIRPORT" />
              <DateSelector label="DEPARTURE DATE" />
              <DateSelector label="RETURN DATE" /> 
          </div>
          <div className='d-flex flex-inline'>
              <FlightDepartureSelector label="DEPARTURE AIRPORT" />
              <FlightDestinationSelector label="DESTINATION AIRPORT" />
              <DateSelector label="DEPARTURE DATE" />
              <DateSelector label="RETURN DATE" /> 
          </div>
        </div>
      )}
    </div>
  );
}


function SwapIcon() {
  return (
    <img className="swap-icon" src={swapIcon} alt="swap icon" />
  );
}

// DateSelector with label passed as prop
function DateSelector({ label }) {
  const [startDate, setStartDate] = useState(new Date());
  const datePickerRef = useRef(null);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const handleDateChange = (selectedDate) => {
    setStartDate(selectedDate);
  };

  const day = startDate.toLocaleString('en-US', { weekday: 'short' });
  const month = startDate.toLocaleString('en-US', { month: 'short' });
  const date = startDate.getDate();
  const year = startDate.getFullYear().toString().slice(-2);

  return (
  <div className="date-selector-outer-container">
    <p className="date-selector-label">{label}</p>
    <div className="date-selector-inner-container" onClick={handleIconClick}>
      <img className="date-selector-calendar-icon date-selector-icons" src={calendar} alt="calendar icon" />
      <span className="date-selector-date-display">{date}</span>
      <img className="date-selector-division-icon" src={division} alt="division icon" />
      <div className="date-selector-day-month-display">
        <div className="date-selector-day-display">{day}</div>
        <div className="date-selector-mmmyy-display">{month}'{year}</div>
      </div>
      <img 
        className="date-selector-dropdown-icon date-selector-icons"
        src={dropDownIcon} 
        alt="dropdown icon" 
      />
      <DatePicker
        ref={datePickerRef}
        selected={startDate}
        onChange={handleDateChange}
        className="date-selector-hidden-datepicker date-picker"
        onClickOutside={() => datePickerRef.current.setOpen(false)}
      />
    </div>
  </div>
  );
}

// PortSelector with label passed as prop
// function PortSelector({ label }) {
//   const [selectedPort, setSelectedPort] = useState({
//     cityName: 'Davao',
//     airportCode: 'DVO',
//     airportName: 'Francisco Bangoy International Airport',
//   });
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handlePortClick = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handlePortSelect = (flight) => {
//     setSelectedPort(flight);
//     setIsDropdownOpen(false);
//   };

//   const truncateText = (text, maxLength) => {
//     return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
//   };

//   const port = selectedPort.airportCode;
//   const cityName = selectedPort.cityName;
//   const airportName = truncateText(selectedPort.airportName, 22);

//   // Determine the plane icon based on the label
//   const planeIcon = label === "DEPARTURE AIRPORT" ? planeUp : planeDown;
//   const conditionalId = label === "DESTINATION AIRPORT" ? "destination-shift-left" : "";

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [dropdownRef]);



//   return (
//     <div className="port-selector-outer-container" id={conditionalId}>
//       <p className="port-selector-label">{label}</p>
//       <div className="port-selector-inner-container" onClick={handlePortClick}>
//         <img className="port-selector-plane-icon port-selector-icons" src={planeIcon} alt='plane icon' />
//         <span className="port-selector-port-code">{port}</span>
//         <img className="port-selector-division-icon" src={division} alt='division icon' />
//         <div className="port-selector-city-airport-display">
//           <div className="port-selector-city-display">{cityName}</div>
//           <div className="port-selector-airport-display">{airportName}</div>
//         </div>
//         <img
//           className="port-selector-dropdown-icon port-selector-icons"
//           src={dropDownIcon}
//           alt="dropdown icon"
//         />
//         {isDropdownOpen && (
//           <div className="port-selector-dropdown" ref={dropdownRef}>
//             {flights.map((flight, index) => (
//               <div
//                 key={index}
//                 className="port-selector-dropdown-item"
//                 onClick={() => handlePortSelect(flight)}
//               >
//                 <div className='port-select-dropdown-options'>
//                   <div className="port-selector-dropdown-city">{flight.cityName} - {flight.airportName}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


function PortSelector({ label }) {
  const { isOpen, toggleDropdown, dropdownRef } = useDropdown();
  const [selectedPort, setSelectedPort] = useState({
    cityName: 'Davao',
    airportCode: 'DVO',
    airportName: 'Francisco Bangoy International Airport',
  });

  const handlePortSelect = (flight) => {
    setSelectedPort(flight);
    toggleDropdown(); // This closes the dropdown
  };

  const port = selectedPort.airportCode;
  const cityName = selectedPort.cityName;
  const airportName = truncateText(selectedPort.airportName, 22);

  const planeIcon = label === "DEPARTURE AIRPORT" ? planeUp : planeDown;
  const conditionalId = label === "DESTINATION AIRPORT" ? "destination-shift-left" : "";

  return (
    <div className="port-selector-outer-container" id={conditionalId}>
      <p className="port-selector-label">{label}</p>
      <div className="port-selector-inner-container" onClick={toggleDropdown}>
        <img className="port-selector-plane-icon port-selector-icons" src={planeIcon} alt='plane icon' />
        <span className="port-selector-port-code">{port}</span>
        <img className="port-selector-division-icon" src={division} alt='division icon' />
        <div className="port-selector-city-airport-display">
          <div className="port-selector-city-display">{cityName}</div>
          <div className="port-selector-airport-display">{airportName}</div>
        </div>
        <img
          className="port-selector-dropdown-icon port-selector-icons"
          src={dropDownIcon}
          alt="dropdown icon"
        />
        {isOpen && (
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
    </div>
  );
}


function FlightDepartureSelector({ label }) {
  return <PortSelector label={label} />;
}

function FlightDestinationSelector({ label }) {
  return <PortSelector label={label} />;
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

export default FlightSearchSelector;
export { DateSelector, PortSelector, FlightDepartureSelector, FlightDestinationSelector };