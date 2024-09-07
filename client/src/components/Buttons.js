import React, { useState } from 'react';
import searchIcon from '../assets/searchicon.png';
import '../styles/buttons.css';

function SearchFlightButton({ link }) {
  return (
    <>
      {link ? (
        <a href={link} className="search-flight-button-link">
          <div className="search-flight-button-container">
            <span className="search-flight-button-text">Search Flights</span>
            <img className="search-flight-button-icon" src={searchIcon} alt="flight search button" />
          </div>
        </a>
      ) : (
        <button type="submit" className="search-flight-button-link">
          <div className="search-flight-button-container">
            <span className="search-flight-button-text">Search Flights</span>
            <img className="search-flight-button-icon" src={searchIcon} alt="flight search button" />
          </div>
        </button>
      )}
    </>
  );
}


function ContinueButton({ link }) {
  return (
    <>
      {link ? (
        <a href={link} className="continue-button-link">
          <div className="continue-button-container">
            <span className="continue-button-text">CONTINUE</span>
          </div>
        </a>
      ) : (
        <button type="submit" className="continue-button-link">
          <div className="continue-button-container">
            <span className="continue-button-text">CONTINUE</span>
          </div>
        </button>
      )}
    </>
  );
}


function BackButton({ link }) {
  return (
    <a href={link} className="back-button-link">
      <div className="back-button-container">
        <span className="back-button-text">BACK</span>
      </div>
    </a>
  );
}


  
  // function SelectButton() {
  //   const [isSelected, setIsSelected] = useState(false);
  
  //   const handleToggleSelect = () => {
  //     setIsSelected(!isSelected); // Toggle the selected state
  //   };
  
  //   const buttonClass = isSelected ? 'select-button-container selected' : 'select-button-container';
  
  //   return (
  //     <button type="button" className="select-button-link" onClick={handleToggleSelect}>
  //       <div className={buttonClass}>
  //         <span className="select-button-text">SELECT</span>
  //       </div>
  //     </button>
  //   );
  // }

  function SelectButton({ isSelected, onClick }) {
    return (
      <button 
        className={`select-button ${isSelected ? 'selected' : ''}`} 
        onClick={onClick}
      >
        {isSelected ? 'SELECT' : 'SELECT'}
      </button>
    );
  }
  


function SubmitButton() {
  return (
    <button type="submit" className="submit-button-link">
      <div className="submit-button-container">
        <span className="submit-button-text">Submit</span>
      </div>
    </button>
  );
}


  export default SearchFlightButton;
  export { ContinueButton, BackButton, SelectButton, SubmitButton};

