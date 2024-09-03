import React, { useState } from 'react';
import planeUp from '../assets/planeup.png';
import planeDown from '../assets/planedown.png';
import division from '../assets/division.png';
import dropDownIcon from '../assets/dropdown.png';
import swapIcon from '../assets/swapicon.png'; 
import '../styles/portselector.css';

function PortSelector({ portOptions, setDeparturePort, setDestinationPort }) {
    const [selectedDeparturePort, setSelectedDeparturePort] = useState({});
    const [selectedDestinationPort, setSelectedDestinationPort] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(null); 

    const handlePortClick = (portType) => {
        setIsDropdownOpen(isDropdownOpen === portType ? null : portType); 
    };

    const handlePortSelect = (port, portType) => {
        if (portType === 'departure') {
            setSelectedDeparturePort(port);
            setDeparturePort(port);  // Update parent component state
        } else {
            setSelectedDestinationPort(port);
            setDestinationPort(port);  // Update parent component state
        }
        setIsDropdownOpen(null); 
    };

    const swapPorts = () => {
        const temp = selectedDeparturePort;
        setSelectedDeparturePort(selectedDestinationPort);
        setSelectedDestinationPort(temp);

        setDeparturePort(selectedDestinationPort);  // Update parent component state
        setDestinationPort(temp);  // Update parent component state
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const renderPortSelector = (label, port, portType) => {
        const planeIcon = label === "DEPARTURE AIRPORT" ? planeUp : planeDown;
        const portCode = port.portCode || '';
        const cityName = port.cityName || '';
        const airportName = truncateText(port.airportName || '', 25);

        // Filter the destination options to exclude the selected departure port
        const filteredPortOptions = portType === 'destination'
            ? portOptions.filter(option => option.portCode !== selectedDeparturePort.portCode)
            : portOptions;

        return (
            <div className="port-selector-inner-container" onClick={() => handlePortClick(portType)}>
                <img className="port-selector-plane-icon port-selector-icons" src={planeIcon} alt='plane icon' />
                <span className="port-selector-port-code">{portCode}</span>
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
                {isDropdownOpen === portType && (
                    <div className="port-selector-dropdown">
                        {filteredPortOptions.map((port, index) => (
                            <div
                                key={index}
                                className="port-selector-dropdown-item"
                                onClick={() => handlePortSelect(port, portType)}
                            >
                                <div className='port-select-dropdown-options'>
                                    <div className="port-selector-dropdown-city">
                                        {port.cityName} - {port.airportName}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="port-selector-outer-container">
            <div className="d-flex port-selection-container">
                {renderPortSelector("DEPARTURE AIRPORT", selectedDeparturePort, 'departure')}
                <img 
                    className="port-selector-swap-icon" 
                    src={swapIcon} 
                    alt="swap icon" 
                    onClick={swapPorts} 
                    style={{ cursor: 'pointer' }}
                />
                {renderPortSelector("DESTINATION AIRPORT", selectedDestinationPort, 'destination')}
            </div>
        </div>
    );
}

export default PortSelector;
