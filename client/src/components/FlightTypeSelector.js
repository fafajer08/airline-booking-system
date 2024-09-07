import React, { useState } from 'react';
import dropDown from '../assets/dropdown.png'; // Adjust the path as necessary
import '../styles/flighttypeselector.css'; // Assuming you save the styles in this file

function FlightTypeSelector({ onFlightTypeChange }) {
    const [flightType, setFlightType] = useState('oneWay'); // Default to 'oneWay'

    const handleFlightTypeChange = (event) => {
        const selectedType = event.target.value;
        setFlightType(selectedType);
        onFlightTypeChange(selectedType); // Pass the selected flight type to the parent
    };

    return (
        <div className="flight-type-selector-container">
            <label htmlFor="flightType" className="flight-type-selector-label">FLIGHT TYPE</label>
            <select
                id="flightType"
                className="flight-type-selector"
                value={flightType}
                onChange={handleFlightTypeChange}
            >
                <option value="oneway">ONE WAY</option>
                <option value="roundtrip">ROUND TRIP</option>
                <option value="multicity">MULTI CITY</option>
            </select>
            <img 
                src={dropDown} 
                alt="Dropdown Arrow" 
                className="flight-type-selector-arrow" 
            />
        </div>
    );
}

export default FlightTypeSelector;
