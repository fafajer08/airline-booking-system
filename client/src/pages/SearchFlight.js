import React, { useState } from 'react';
import NavBar from "../components/NavBar";
import SearchFlightButton,{ ContinueButton, BackButton, SelectButton, SubmitButton } from "../components/Buttons";
import DateSelector from "../components/DateSelector";
import PortSelector from "../components/PortSelector";
import flightsData from '../data/flightsData';
import parseData from '../components/FlightsDataParser';
import PaxSelector from '../components/PaxSelector';
import InputBox from '../components/InputBox';
import FlightTypeSelector from "../components/FlightTypeSelector.js";
import "../styles/searchflight.css"

export default function SearchFlight() {
  const portOptions = parseData(flightsData);

  const [flightType, setFlightType] = useState('oneway'); // Default flight type

  const [departurePort, setDeparturePort] = useState({});
  const [destinationPort, setDestinationPort] = useState({});
  const [secondDeparturePort, setSecondDeparturePort] = useState({});
  const [secondDestinationPort, setSecondDestinationPort] = useState({});

  const [departureDate, setDepartureDate] = useState(null);
  const [secondDepartureDate, setSecondDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const [adultsCount, setAdultsCount] = useState(0);
  const [chilrentCount, setChildrentCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);

  const [input, setInput] = useState(null);

  const handleFlightTypeChange = (selectedType) => {
    setFlightType(selectedType);
    console.log("Selected Flight Type:", selectedType);
  };

  return (
    <div className='my-5'>
      <div className='container'>
        <h1 className="my-5 mx-5">Where would you like to go?</h1>
        
        {/* Adjust the spacing here */}
        <div className="d-flex align-items-center justify-content-center mb-2">  
          <FlightTypeSelector onFlightTypeChange={handleFlightTypeChange} />
        </div>
        
        <form>
          {flightType === 'oneway' && (
            <div className='container-fluid'>
              <div className='first-row d-flex flex-column my-3 d-flex align-items-center flex-lg-row'>
              <PortSelector 
                    portOptions={portOptions} 
                    setDeparturePort={setDeparturePort} 
                    setDestinationPort={setDestinationPort} 
                  />
                <DateSelector label="DEPARTURE DATE" onDateChange={setDepartureDate} />
              </div>
              <div className='second-row d-flex flex-column my-3 d-flex align-items-center flex-lg-row'>
                <PaxSelector label={'ADULTS (12+ YEARS)'} setPaxCount={setAdultsCount} />
                <PaxSelector label={'CHILDREN (2-11 YEARS)'} setPaxCount={setChildrentCount} />
                <PaxSelector label={'INFANTS (UNDER 2 YEARS)'} setPaxCount={setInfantsCount} />
                <InputBox label="ENTER PROMO CODES" placeholder="Enter Code" onChange={setInput}/>
              </div>
              <div className='submit-btn d-flex justify-content-center justify-content-lg-end'>
                <SearchFlightButton link="http://localhost:3000/flightoptions" />
              </div>
            </div>
          )}

          {flightType === 'roundtrip' && (
            <div>
              <div className="first-row  flex-column my-3 d-flex align-items-center flex-lg-row">
              <PortSelector 
                    portOptions={portOptions} 
                    setDeparturePort={setDeparturePort} 
                    setDestinationPort={setDestinationPort} 
                  />
                 <DateSelector label="DEPARTURE DATE" onDateChange={setDepartureDate} />
                 <DateSelector label="RETURN DATE" onDateChange={setReturnDate} />
              </div>
              
              <div className="second-row d-flex flex-column my-3 d-flex align-items-center flex-lg-row">
              <PaxSelector label={'ADULTS (12+ YEARS)'} setPaxCount={setAdultsCount} />
                <PaxSelector label={'CHILDREN (2-11 YEARS)'} setPaxCount={setChildrentCount} />
                <PaxSelector label={'INFANTS (UNDER 2 YEARS)'} setPaxCount={setInfantsCount} />
                <InputBox label="ENTER PROMO CODES" placeholder="Enter Code" onChange={setInput}/>
              </div>
              <div className='submit-btn d-flex justify-content-center justify-content-lg-end'>
                <SearchFlightButton link="http://localhost:3000/flightoptions" />
              </div>
            </div>
          )}

          {flightType === 'multicity' && (
            <div className='selector-container'>
              <div className="first-row d-flex flex-column my-3 d-flex align-items-center flex-lg-row">
              <PortSelector 
                    portOptions={portOptions} 
                    setDeparturePort={setDeparturePort} 
                    setDestinationPort={setDestinationPort} 
                  />
                <DateSelector label="DEPARTURE DATE" onDateChange={setDepartureDate} />
              </div>
              <div className="second-row d-flex flex-column my-3 d-flex align-items-center flex-lg-row">
              <PortSelector 
                    portOptions={portOptions} 
                    setDeparturePort={setSecondDeparturePort} 
                    setDestinationPort={setSecondDestinationPort} 
                  />
                <DateSelector label="DEPARTURE DATE" onDateChange={setSecondDepartureDate} />
              </div>
              <div className="third-row d-flex flex-column my-3 d-flex align-items-center flex-lg-row">
              <PaxSelector label={'ADULTS (12+ YEARS)'} setPaxCount={setAdultsCount} />
                <PaxSelector label={'CHILDREN (2-11 YEARS)'} setPaxCount={setChildrentCount} />
                <PaxSelector label={'INFANTS (UNDER 2 YEARS)'} setPaxCount={setInfantsCount} />
                <InputBox label="ENTER PROMO CODES" placeholder="Enter Code" onChange={setInput}/>
              </div>
              <div className='submit-btn d-flex justify-content-center justify-content-lg-end'>
                <SearchFlightButton className="src-btn" link="http://localhost:3000/flightoptions" />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
