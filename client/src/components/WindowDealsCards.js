import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockDeals from '../data/dealsData';
import '../styles/dealscards.css';

const DealsCards = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setDeals(mockDeals);
    }, 1000);
  }, []);

  const handleCardClick = (title) => {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/deals/${formattedTitle}`);
  };

  return (
    <div className="container" data-aos="fade-up">
      <div className="deals-cards">
        <h3 className="deals-heading">Exclusive Deals and Discounts</h3>
        <p className="deals-description">Take advantage of these amazing offers before completing your booking!</p>

        <div className="deals-cards-container">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="deals-card"
              onClick={() => handleCardClick(deal.title)}
              data-aos="fade-up"
              data-aos-delay="200"
            >
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
