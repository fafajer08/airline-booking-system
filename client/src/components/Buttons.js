import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import searchIcon from '../assets/searchicon.png';
import '../styles/buttons.css';

// BaseButton component for common button styles
function BaseButton({ className, onClick, children }) {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function SearchFlightButton({ link }) {
  return (
    link ? (
      <a href={link} className="search-flight-button-link">
        <div className="search-flight-button-container">
          <span className="search-flight-button-text">Search Flights</span>
          <img className="search-flight-button-icon" src={searchIcon} alt="flight search" />
        </div>
      </a>
    ) : (
      <BaseButton className="search-flight-button-link">
        <div className="search-flight-button-container">
          <span className="search-flight-button-text">Search Flights</span>
          <img className="search-flight-button-icon" src={searchIcon} alt="flight search" />
        </div>
      </BaseButton>
    )
  );
}

function ContinueButton({ link }) {
  return (
    link ? (
      <Link to={link} className="continue-button-link">
        <div className="continue-button-container">
          <span className="continue-button-text">CONTINUE</span>
        </div>
      </Link>
    ) : (
      <BaseButton className="continue-button-link">
        <div className="continue-button-container">
          <span className="continue-button-text">CONTINUE</span>
        </div>
      </BaseButton>
    )
  );
}

function BackButton({ link }) {
  return (
    <Link to={link} className="back-button-link">
      <div className="back-button-container">
        <span className="back-button-text">BACK</span>
      </div>
    </Link>
  );
}

function SelectButton({ isSelected, onClick }) {
  return (
    <BaseButton 
      className={`select-button ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <span className="select-button-text">{isSelected ? 'SELECTED' : 'SELECT'}</span>
    </BaseButton>
  );
}

function SubmitButton() {
  return (
    <BaseButton className="submit-button-link">
      <div className="submit-button-container">
        <span className="submit-button-text">Submit</span>
      </div>
    </BaseButton>
  );
}

export default SearchFlightButton;
export { ContinueButton, BackButton, SelectButton, SubmitButton };
