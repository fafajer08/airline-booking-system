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
import searchIcon from '../assets/searchicon.png';
import '../styles/searchflight.css';


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
  },
  {
    cityName: 'Cebu', 
    airportCode: 'CEB',
    airportName: 'Mactan-Cebu International Airport'
  },
  {
    cityName: 'Clark', 
    airportCode: 'CRK',
    airportName: 'Clark International Airport'
  },
  {
    cityName: 'Iloilo', 
    airportCode: 'ILO',
    airportName: 'Iloilo International Airport'
  },
  {
    cityName: 'Puerto Princesa', 
    airportCode: 'PPS',
    airportName: 'Puerto Princesa International Airport'
  },
  {
    cityName: 'Cagayan de Oro', 
    airportCode: 'CGY',
    airportName: 'Laguindingan Airport'
  },
  {
    cityName: 'Bacolod', 
    airportCode: 'BCD',
    airportName: 'Bacolod-Silay International Airport'
  },
  {
    cityName: 'Kalibo', 
    airportCode: 'KLO',
    airportName: 'Kalibo International Airport'
  },
  {
    cityName: 'Tagbilaran', 
    airportCode: 'TAG',
    airportName: 'Tagbilaran Airport'
  },
  {
    cityName: 'Zamboanga', 
    airportCode: 'ZAM',
    airportName: 'Zamboanga International Airport'
  },
  {
    cityName: 'General Santos', 
    airportCode: 'GES',
    airportName: 'General Santos International Airport'
  },
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

function SearchFlightButton() {
  return (
    <button type="submit" className="flight-search-button-link">
      <div className="flight-search-button-container">
        <span className="flight-search-button-text">Search Flights</span>
        <img className="flight-search-button-icon" src={searchIcon} alt="flight search button" />
      </div>
    </button>
  );
}

function SwapIcon({ onSwap }) {
  return (
    <div className="swap-icon-outer-container">
    <img className="swap-icon" src={swapIcon} alt="swap icon" onClick={onSwap} style={{ cursor: 'pointer' }} />
    </div>
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


function PortSelector({ label, selectedPort, setSelectedPort }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  const airportName = truncateText(selectedPort.airportName, 25);

  const planeIcon = label === "DEPARTURE AIRPORT" ? planeUp : planeDown;

  return (
    <div className="port-selector-outer-container">
      <p className="port-selector-label">{label}</p>
      <div className="port-selector-inner-container" onClick={handlePortClick}>
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
        {isDropdownOpen && (
          <div className="port-selector-dropdown">
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

  const paxOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const typeLabel = {
    ADULTS: '(12+ YEARS)',
    CHILDREN: '(2-11 YEARS)',
    INFANTS: '(UNDER 2 YEARS)'
  }[type] || 'Passengers';

  return (
    <div className="pax-selector-outer-container">
     <span className="pax-selector-label">{type} <span className="type-label">{typeLabel}</span> </span> 
      <div className="pax-selector-inner-container container" onClick={handlePaxClick}>
       
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

function PromoCodeInput() {
  const [promoCode, setPromoCode] = useState('');

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };

  return (
    <div className="promo-code-outer-container">
      <p className="promo-code-label">ENTER PROMO CODE</p>
      <div className="promo-code-inner-container">
        <input
          type="text"
          className="promo-code-input"
          value={promoCode}
          onChange={handlePromoCodeChange}
          placeholder="Enter code"
        />
      </div>
    </div>
  );
}


function FlightSearchSelector() {
  const [departureAirport, setDepartureAirport] = useState({
    cityName: 'Davao',
    airportCode: 'DVO',
    airportName: 'Francisco Bangoy International Airport'
  });

  const [destinationAirport, setDestinationAirport] = useState({
    cityName: 'Manila',
    airportCode: 'MNL',
    airportName: 'NAIA International Airport'
  });

  const [tripType, setTripType] = useState('oneWay');

  const handleTripTypeChange = (event) => {
    setTripType(event.target.value);
  };

  const swapAirports = () => {
    const temp = departureAirport;
    setDepartureAirport(destinationAirport);
    setDestinationAirport(temp);
  };

  return (
    <div>   
      <select className="flight-search-selector" value={tripType} onChange={handleTripTypeChange}>
        <option value="oneWay">ONE WAY</option>
        <option value="roundTrip">ROUND TRIP</option>
        <option value="multiCity">MULTI CITY</option>
      </select>

      {tripType === 'oneWay' && (
        <div className='container-fluid'>
          <div className='first-row d-flex flex-column m-5 d-flex align-items-center flex-lg-row' >      
            <PortSelector className='' label="DEPARTURE AIRPORT"  selectedPort={departureAirport} setSelectedPort={setDepartureAirport} />
            <SwapIcon className='' onSwap={swapAirports} />
            <PortSelector className='' label="DESTINATION AIRPORT" selectedPort={destinationAirport} setSelectedPort={setDestinationAirport}  />
            <DateSelector className='d-flex' label="DEPARTURE DATE" />
          </div> 
          <div className='second-row d-flex flex-column m-5 d-flex align-items-center flex-lg-row'>      
              <PaxSelector className='' type="ADULTS" />
              <PaxSelector className='' type="CHILDREN" />
              <PaxSelector className='' type="INFANTS" />
              <PromoCodeInput /> 
          </div> 
          <div className='submit-btn d-flex justify-content-center justify-content-lg-end'>
            <SearchFlightButton />
          </div>
        </div>
      )}
      {tripType === 'roundTrip' && (
        <div>
          <div className="first-row d-flex flex-column m-5 d-flex align-items-center flex-lg-row"> 
              <PortSelector  label="DEPARTURE AIRPORT"  selectedPort={departureAirport} setSelectedPort={setDepartureAirport}  />
              <SwapIcon onSwap={swapAirports} />
              <PortSelector label="DESTINATION AIRPORT"  selectedPort={destinationAirport}  setSelectedPort={setDestinationAirport} />
              <DateSelector label="DEPARTURE DATE" />
              <DateSelector label="RETURN DATE" />
          </div>
          <div className="second-row d-flex flex-column m-5 d-flex align-items-center flex-lg-row" > 
              <PaxSelector type="ADULTS" />
              <PaxSelector type="CHILDREN" />
              <PaxSelector type="INFANTS" />
              <PromoCodeInput /> 
          </div>
          <div className='submit-btn d-flex justify-content-center justify-content-lg-end'>
            <SearchFlightButton />
          </div>
        </div>
      )}

      {tripType === 'multiCity' && (
        <div className='selector-container'>
          <div className="first-row d-flex flex-column m-5 d-flex align-items-center flex-lg-row"> 
              <PortSelector  label="DEPARTURE AIRPORT" selectedPort={departureAirport}  setSelectedPort={setDepartureAirport} />
              <SwapIcon onSwap={swapAirports} />
              <PortSelector  label="DESTINATION AIRPORT" selectedPort={destinationAirport} setSelectedPort={setDestinationAirport}  />
              <DateSelector label="DEPARTURE DATE" />
          </div>
          <div className="second-row d-flex flex-column m-5 d-flex align-items-center flex-lg-row"> 
              <PortSelector  label="DEPARTURE AIRPORT" selectedPort={departureAirport}  setSelectedPort={setDepartureAirport}  />
              <SwapIcon onSwap={swapAirports} />
              <PortSelector label="DESTINATION AIRPORT" selectedPort={destinationAirport} setSelectedPort={setDestinationAirport}  />
              <DateSelector label="DEPARTURE DATE" />
          </div>
          <div className="third-row d-flex flex-column m-5 d-flex align-items-center flex-lg-row" > 
              <PaxSelector type="ADULTS" />
              <PaxSelector type="CHILDREN" />
              <PaxSelector type="INFANTS" />
              <PromoCodeInput /> 
          </div>
          <div className='ubmit-btn d-flex justify-content-center justify-content-lg-end'>
            <SearchFlightButton />
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightSearchSelector;
export {
  DateSelector,
  PortSelector,
  FlightDepartureSelector,
  FlightDestinationSelector,
  PaxSelector,
  PromoCodeInput,
  SearchFlightButton,
  SwapIcon
};