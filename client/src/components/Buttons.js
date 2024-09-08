import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use Link and useNavigate for internal navigation
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
  const navigate = useNavigate(); // Use useNavigate for navigation
  const handleNavigation = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <BaseButton className="search-flight-button-link" onClick={handleNavigation}>
      <div className="search-flight-button-container">
        <span className="search-flight-button-text">Search Flights</span>
        <img className="search-flight-button-icon" src={searchIcon} alt="flight search" />
      </div>
    </BaseButton>
  );
}

function ContinueButton({ link }) {
  const navigate = useNavigate(); // Use useNavigate for navigation
  const handleNavigation = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <BaseButton className="continue-button-link" onClick={handleNavigation}>
      <div className="continue-button-container">
        <span className="continue-button-text">CONTINUE</span>
      </div>
    </BaseButton>
  );
}

function BackButton({ link }) {
  const navigate = useNavigate(); // Use useNavigate for navigation
  const handleNavigation = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <BaseButton className="back-button-link" onClick={handleNavigation}>
      <div className="back-button-container">
        <span className="back-button-text">BACK</span>
      </div>
    </BaseButton>
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
