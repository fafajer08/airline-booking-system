import React, { useState, useRef, useEffect } from 'react';
import dropDownIcon from '../assets/dropdown.png';
import '../styles/selectorpax.css';


function PaxSelector({ label, setPaxCount }) { // Accepts setPaxCount as a prop
  const [paxCount, setLocalPaxCount] = useState(0); // Initialize with 1 passenger
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handlePaxClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handlePaxSelect = (pax) => {
    setLocalPaxCount(pax);
    setPaxCount(pax); // Update the pax count in the parent component
    setIsDropdownOpen(false);
  };

  const paxOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


  return (
    <div className="pax-selector-outer-container">
      <span className="pax-selector-label">{label} </span>
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

export default PaxSelector;