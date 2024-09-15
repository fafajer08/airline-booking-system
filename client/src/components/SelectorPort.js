// import React, { useState, useEffect } from 'react';
// import planeUp from '../assets/planeup.png';
// import planeDown from '../assets/planedown.png';
// import division from '../assets/division.png';
// import dropDownIcon from '../assets/dropdown.png';
// import swapIcon from '../assets/swapicon.png'; 
// import '../styles/selectorport.css';

// function PortSelector({ portOptions = [], setDeparturePort, setDestinationPort }) {
//     const [selectedDeparturePort, setSelectedDeparturePort] = useState(null);
//     const [selectedDestinationPort, setSelectedDestinationPort] = useState(null);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(null);

//     useEffect(() => {
//         // Set default values if available
//         if (portOptions.length > 0) {
//             setSelectedDeparturePort(portOptions[0]);
//             setSelectedDestinationPort(portOptions[1]);
//             setDeparturePort(portOptions[0]);
//             setDestinationPort(portOptions[1]);
//         }
//     }, [portOptions]);

//     const handlePortClick = (portType) => {
//         setIsDropdownOpen(isDropdownOpen === portType ? null : portType);
//     };

//     const handlePortSelect = (port, portType) => {
//         if (portType === 'departure') {
//             setSelectedDeparturePort(port);
//             setDeparturePort(port);
//         } else {
//             setSelectedDestinationPort(port);
//             setDestinationPort(port);
//         }
//         setIsDropdownOpen(null);
//     };

//     const swapPorts = () => {
//         const temp = selectedDeparturePort;
//         setSelectedDeparturePort(selectedDestinationPort);
//         setSelectedDestinationPort(temp);

//         setDeparturePort(selectedDestinationPort);
//         setDestinationPort(temp);
//     };

//     const truncateText = (text, maxLength) => {
//         return text && text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
//     };

//     const renderPortSelector = (label, port, portType) => {
//         const planeIcon = label === "DEPARTURE AIRPORT" ? planeUp : planeDown;
//         const portCode = port?.portCode || '';
//         const cityName = port?.cityName || '';
//         const airportName = truncateText(port?.airportName || '', 25);

//         const filteredPortOptions = portType === 'destination'
//             ? portOptions.filter(option => option.portCode !== selectedDeparturePort?.portCode)
//             : portOptions;

//         return (
//             <div className="port-selector-outer-container">
//                 <p className="port-selector-label">{label}</p>
//                 <div className="port-selector-inner-container" onClick={() => handlePortClick(portType)}>
//                     <img className="port-selector-plane-icon port-selector-icons" src={planeIcon} alt={`plane icon for ${label}`} />
//                     <span className="port-selector-port-code">{portCode}</span>
//                     <img className="port-selector-division-icon" src={division} alt="division icon" />
//                     <div className="port-selector-city-airport-display">
//                         <div className="port-selector-city-display">{cityName}</div>
//                         <div className="port-selector-airport-display">{airportName}</div>
//                     </div>
//                     <img
//                         className="port-selector-dropdown-icon port-selector-icons"
//                         src={dropDownIcon}
//                         alt="dropdown icon"
//                     />
//                     {isDropdownOpen === portType && (
//                         <div className="port-selector-dropdown">
//                             {filteredPortOptions.map((port) => (
//                                 <div
//                                     key={port.portCode}
//                                     className="port-selector-dropdown-item"
//                                     onClick={() => handlePortSelect(port, portType)}
//                                 >
//                                     <div className="port-select-dropdown-options">
//                                         <div className="port-selector-dropdown-city">
//                                             {port.cityName} - {port.airportName}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="port-selection-container">
//             <div className="d-flex flex-column flex-md-row align-items-center">
//                 {renderPortSelector("DEPARTURE AIRPORT", selectedDeparturePort, 'departure')}
//                 <img 
//                     className="port-selector-swap-icon" 
//                     src={swapIcon} 
//                     alt="swap icon" 
//                     onClick={swapPorts} 
//                     style={{ cursor: 'pointer' }}
//                 />
//                 {renderPortSelector("DESTINATION AIRPORT", selectedDestinationPort, 'destination')}
//             </div>
//         </div>
//     );
// }

// export default PortSelector;

import React, { useState, useEffect } from 'react';
import planeUp from '../assets/planeup.png';
import planeDown from '../assets/planedown.png';
import division from '../assets/division.png';
import dropDownIcon from '../assets/dropdown.png';
import swapIcon from '../assets/swapicon.png'; 
import '../styles/selectorport.css';

function PortSelector({ portOptions = [], setDeparturePort, setDestinationPort }) {
    const [selectedDeparturePort, setSelectedDeparturePort] = useState(null);
    const [selectedDestinationPort, setSelectedDestinationPort] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);

    useEffect(() => {
        console.log("Received port options in PortSelector:", portOptions); // Debugging port options
        // Set default values if available
        if (portOptions.length > 0) {
            setSelectedDeparturePort(portOptions[0]);
            setSelectedDestinationPort(portOptions[1]);
            setDeparturePort(portOptions[0]);
            setDestinationPort(portOptions[1]);
            console.log("Set initial ports - Departure:", portOptions[0], "Destination:", portOptions[1]); // Debugging initial ports
        }
    }, [portOptions]);

    const handlePortClick = (portType) => {
        setIsDropdownOpen(isDropdownOpen === portType ? null : portType);
    };

    const handlePortSelect = (port, portType) => {
        if (portType === 'departure') {
            setSelectedDeparturePort(port);
            setDeparturePort(port);
        } else {
            setSelectedDestinationPort(port);
            setDestinationPort(port);
        }
        console.log(`Selected ${portType} port:`, port); // Debugging selected port
        setIsDropdownOpen(null);
    };

    const swapPorts = () => {
        const temp = selectedDeparturePort;
        setSelectedDeparturePort(selectedDestinationPort);
        setSelectedDestinationPort(temp);

        setDeparturePort(selectedDestinationPort);
        setDestinationPort(temp);

        console.log("Swapped ports - Departure:", selectedDestinationPort, "Destination:", temp); // Debugging swapped ports
    };

    const truncateText = (text, maxLength) => {
        return text && text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const renderPortSelector = (label, port, portType) => {
        const planeIcon = label === "DEPARTURE AIRPORT" ? planeUp : planeDown;
        const portCode = port?.code || '';  // Use the updated `code` field
        const cityName = port?.city || '';  // Use the updated `city` field
        const airportName = truncateText(port?.name || '', 25);  // Use the updated `name` field

        const filteredPortOptions = portType === 'destination'
            ? portOptions.filter(option => option.code !== selectedDeparturePort?.code)
            : portOptions;

        return (
            <div className="port-selector-outer-container">
                <p className="port-selector-label">{label}</p>
                <div className="port-selector-inner-container" onClick={() => handlePortClick(portType)}>
                    <img className="port-selector-plane-icon port-selector-icons" src={planeIcon} alt={`plane icon for ${label}`} />
                    <span className="port-selector-port-code">{portCode}</span>
                    <img className="port-selector-division-icon" src={division} alt="division icon" />
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
                            {filteredPortOptions.map((port) => (
                                <div
                                    key={port.code} // Use the `code` field as a unique key
                                    className="port-selector-dropdown-item"
                                    onClick={() => handlePortSelect(port, portType)}
                                >
                                    <div className="port-select-dropdown-options">
                                        <div className="port-selector-dropdown-city">
                                            {port.city} - {port.name}  {/* Use `city` and `name` fields */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="port-selection-container">
            <div className="d-flex flex-column flex-md-row align-items-center">
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
