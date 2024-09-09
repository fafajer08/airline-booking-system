import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import mockDeals from '../data/dealsData';  // Import mock data
import '../styles/dealscards.css';  // Import the pure CSS for DealsCards

const DealsCards = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();  // Initialize the useNavigate hook

  // Simulate fetching data from the backend (for now, using mock data)
  useEffect(() => {
    // Simulating an API call with mock data
    setTimeout(() => {
      setDeals(mockDeals);  // Set the mock deals data
    }, 1000);
  }, []);

  // Function to handle card click
  const handleCardClick = (title) => {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');  // Format the title for the URL
    navigate(`/deals/${formattedTitle}`);  // Navigate to the deals/{title} endpoint
  };

  return (
    <div className="container">
      <div className="deals-cards">
        <h3 className="deals-heading">Exclusive Deals and Discounts</h3>
        <p className="deals-description">Take advantage of these amazing offers before completing your booking!</p>

        <div className="deals-cards-container">
          {deals.map((deal) => (
            <div key={deal.id} className="deals-card" onClick={() => handleCardClick(deal.title)}>
              <img src={deal.image} alt={deal.title} className="deals-card-img" />
              <div className="deals-card-body">
                <h4 className="deals-card-title">{deal.title}</h4>
                <p className="deals-card-text">{deal.description}</p>
                <p className="deals-card-mechanics"><strong>Mechanics:</strong> {deal.mechanics}</p>
                <p className="deals-card-promo-dates">
                  <strong>Promo Period:</strong> {deal.promoDates.start} to {deal.promoDates.end}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsCards;
