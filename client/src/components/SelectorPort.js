
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
//         console.log("Received port options in PortSelector:", portOptions); // Debugging port options
//         // Set default values if available
//         if (portOptions.length > 0) {
//             const defaultDeparture = portOptions[0];
//             const defaultDestination = portOptions[1] || portOptions[0]; // Fallback to first port if only one is available
//             setSelectedDeparturePort(defaultDeparture);
//             setSelectedDestinationPort(defaultDestination);
//             setDeparturePort(defaultDeparture);
//             setDestinationPort(defaultDestination);
//             //console.log("Set initial ports - Departure:", defaultDeparture, "Destination:", defaultDestination); // Debugging initial ports
//         }
//     }, [portOptions, setDeparturePort, setDestinationPort]);

//     const handlePortClick = (portType) => {
//         setIsDropdownOpen(isDropdownOpen === portType ? null : portType);
//     };

//     const handlePortSelect = (port, portType) => {
//         if (portType === 'departure') {
//             setSelectedDeparturePort(port);
//             setDeparturePort(port);
//             // If the selected departure port is the same as the current destination, reset destination
//             if (port.code === selectedDestinationPort?.code) {
//                 const newDestination = portOptions.find(p => p.code !== port.code) || port;
//                 setSelectedDestinationPort(newDestination);
//                 setDestinationPort(newDestination);
//             }
//         } else {
//             setSelectedDestinationPort(port);
//             setDestinationPort(port);
//             // If the selected destination port is the same as the current departure, reset departure
//             if (port.code === selectedDeparturePort?.code) {
//                 const newDeparture = portOptions.find(p => p.code !== port.code) || port;
//                 setSelectedDeparturePort(newDeparture);
//                 setDeparturePort(newDeparture);
//             }
//         }
//         //console.log(`Selected ${portType} port:`, port); // Debugging selected port
//         setIsDropdownOpen(null);
//     };

//     const swapPorts = () => {
//         const temp = selectedDeparturePort;
//         setSelectedDeparturePort(selectedDestinationPort);
//         setSelectedDestinationPort(temp);

//         setDeparturePort(selectedDestinationPort);
//         setDestinationPort(temp);

//         //console.log("Swapped ports - Departure:", selectedDestinationPort, "Destination:", temp); // Debugging swapped ports
//     };

//     const truncateText = (text, maxLength) => {
//         return text && text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
//     };

//     const renderPortSelector = (label, port, portType) => {
//         const planeIcon = label === "Departure City" ? planeUp : planeDown;
//         const portCode = port?.code || '';  // Use the updated `code` field
//         const cityName = port?.city || '';  // Use the updated `city` field
//         const airportName = truncateText(port?.name || '', 20);  // Use the updated `name` field

//         const filteredPortOptions = portType === 'destination'
//             ? portOptions.filter(option => option.code !== selectedDeparturePort?.code)
//             : portOptions;

//         return (
//             <div className="port-selector-outer-container">
//                 <p className="port-selector-label">{label}</p>
//                 <div className="port-selector-inner-container" onClick={() => handlePortClick(portType)}>
//                     <img className="port-selector-plane-icon port-selector-icons" src={planeIcon} alt={`plane icon for ${label}`} />
//                     <span className="port-selector-port-code">{portCode}</span>
//                     {/* <img className="port-selector-division-icon" src={division} alt="division icon" /> */}
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
//                             {filteredPortOptions.map((portOption) => (
//                                 <div
//                                     key={portOption.code} // Use the `code` field as a unique key
//                                     className="port-selector-dropdown-item"
//                                     onClick={() => handlePortSelect(portOption, portType)}
//                                 >
//                                     <div className="port-select-dropdown-options">
//                                         <div className="port-selector-dropdown-city">
//                                             {portOption.city} - {portOption.name}  {/* Use `city` and `name` fields */}
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
//                 {renderPortSelector("Departure City", selectedDeparturePort, 'departure')}
//                 <img 
//                     className="port-selector-swap-icon" 
//                     src={swapIcon} 
//                     alt="swap icon" 
//                     onClick={swapPorts} 
//                     style={{ cursor: 'pointer', margin: '0 -5px' }}
//                 />
//                 {renderPortSelector("Arrival City", selectedDestinationPort, 'destination')}
//             </div>
//         </div>
//     );
// }

// export default PortSelector;


import React, { useState, useEffect } from 'react';
import planeUp from '../assets/planeup.png';
import planeDown from '../assets/planedown.png';
import dropDownIcon from '../assets/dropdown.png';
import swapIcon from '../assets/swapicon.png'; 
import '../styles/selectorport.css';

function PortSelector({ portOptions = [], departurePort, destinationPort, setDeparturePort, setDestinationPort }) {
    const [selectedDeparturePort, setSelectedDeparturePort] = useState(departurePort || null);
    const [selectedDestinationPort, setSelectedDestinationPort] = useState(destinationPort || null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);

    // Initialize default ports if not set
    useEffect(() => {
        if (portOptions.length > 0) {
            // Only set defaults if parent hasn't set ports yet
            if (!departurePort && !destinationPort) {
                const defaultDeparture = portOptions[0];
                const defaultDestination = portOptions[1] || portOptions[0]; // Fallback to first port if only one is available
                setSelectedDeparturePort(defaultDeparture);
                setSelectedDestinationPort(defaultDestination);
                setDeparturePort(defaultDeparture);
                setDestinationPort(defaultDestination);
                console.log("Set initial ports - Departure:", defaultDeparture, "Destination:", defaultDestination);
            } else {
                // If parent has already set ports, ensure local state matches
                setSelectedDeparturePort(departurePort);
                setSelectedDestinationPort(destinationPort);
            }
        }
    }, [portOptions, departurePort, destinationPort, setDeparturePort, setDestinationPort]);

    // Update local state if parent updates departurePort
    useEffect(() => {
        if (departurePort && departurePort.code !== selectedDeparturePort?.code) {
            setSelectedDeparturePort(departurePort);
        }
    }, [departurePort, selectedDeparturePort]);

    // Update local state if parent updates destinationPort
    useEffect(() => {
        if (destinationPort && destinationPort.code !== selectedDestinationPort?.code) {
            setSelectedDestinationPort(destinationPort);
        }
    }, [destinationPort, selectedDestinationPort]);

    const handlePortClick = (portType) => {
        setIsDropdownOpen(isDropdownOpen === portType ? null : portType);
    };

    const handlePortSelect = (port, portType) => {
        if (portType === 'departure') {
            setSelectedDeparturePort(port);
            setDeparturePort(port);
            // If the selected departure port is the same as the current destination, reset destination
            if (port.code === selectedDestinationPort?.code) {
                const newDestination = portOptions.find(p => p.code !== port.code) || port;
                setSelectedDestinationPort(newDestination);
                setDestinationPort(newDestination);
            }
        } else {
            setSelectedDestinationPort(port);
            setDestinationPort(port);
            // If the selected destination port is the same as the current departure, reset departure
            if (port.code === selectedDeparturePort?.code) {
                const newDeparture = portOptions.find(p => p.code !== port.code) || port;
                setSelectedDeparturePort(newDeparture);
                setDeparturePort(newDeparture);
            }
        }
        console.log(`Selected ${portType} port:`, port);
        setIsDropdownOpen(null);
    };

    const swapPorts = () => {
        if (selectedDeparturePort && selectedDestinationPort) {
            const temp = selectedDeparturePort;
            setSelectedDeparturePort(selectedDestinationPort);
            setSelectedDestinationPort(temp);

            setDeparturePort(selectedDestinationPort);
            setDestinationPort(temp);

            console.log("Swapped ports - Departure:", selectedDestinationPort, "Destination:", temp);
        }
    };

    const truncateText = (text, maxLength) => {
        return text && text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const renderPortSelector = (label, port, portType) => {
        const planeIcon = label === "Departure City" ? planeUp : planeDown;
        const portCode = port?.code || '';  
        // const cityName = port?.city || '';  
        const cityName = truncateText(port?.city || '' , 12); 
        const airportName = truncateText(port?.name || '', 20);  

        const filteredPortOptions = portType === 'destination'
            ? portOptions.filter(option => option.code !== selectedDeparturePort?.code)
            : portOptions;

        return (
            <div className="port-selector-outer-container">
                <p className="port-selector-label">{label}</p>
                <div className="port-selector-inner-container" onClick={() => handlePortClick(portType)}>
                    <img className="port-selector-plane-icon port-selector-icons" src={planeIcon} alt={`plane icon for ${label}`} />
                    <span className="port-selector-port-code">{portCode}</span>
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
                            {filteredPortOptions.map((portOption) => (
                                <div
                                    key={portOption.code} 
                                    className="port-selector-dropdown-item"
                                    onClick={() => handlePortSelect(portOption, portType)}
                                >
                                    <div className="port-select-dropdown-options">
                                        <div className="port-selector-dropdown-city">
                                            {portOption.city} - {portOption.name}  
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
                {renderPortSelector("Departure City", selectedDeparturePort, 'departure')}
                <img 
                    className="port-selector-swap-icon" 
                    src={swapIcon} 
                    alt="swap icon" 
                    onClick={swapPorts} 
                    style={{ cursor: 'pointer', margin: '0 -5px' }}
                />
                {renderPortSelector("Arrival City", selectedDestinationPort, 'destination')}
            </div>
        </div>
    );
}

export default PortSelector;
