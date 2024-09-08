import React from 'react';
import NavBar from "../components/NavBar";
import DealsCards from '../components/DealsCards';
import '../styles/deals.css';  // Import the CSS for DealsPage

export default function DealsPage() {
  return (
    <div>
      <div className="deals-page-container">
        <h5 className="deals-page-subheading">Welcome to our promo page</h5>
        <h2 className="deals-page-heading">Great Discounts</h2>
        <p className="deals-page-text">Take advantage of these amazing offers before completing your booking!</p>
        <DealsCards />
      </div>
    </div>
  );
}
