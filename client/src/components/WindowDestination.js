import React from 'react';
import { useNavigate } from 'react-router-dom';
import destinations from '../data/destinationsData'; // Import the mock data
import '../styles/windowdestination.css'; // Import the CSS file

export default function WindowDestination() {
    const navigate = useNavigate();

    const handleCardClick = (destination) => {
        navigate(`/details/${destination}`);
    };

    return (
        <div className='window-destination-container'>
            <div className="mt-5">
                <h3 className="window-destination-title"><strong>Your Next Vacation</strong></h3>
                <p className="window-destination-subtitle">Temporibus Facere Doloribus Id Aut. Ea Maiores Esse Accusantium Laboriosam...</p>

                <div className="window-destination-grid">
                    {destinations.map((destination) => (
                        <div key={destination.name} className="window-destination-card" onClick={() => handleCardClick(destination.name)}>
                            <img className="window-destination-image" src={destination.image} alt={destination.name} />
                            <div className="window-destination-body">
                                <div className="window-destination-header">
                                    <h4 className="window-destination-name">{destination.name}</h4>
                                    <div className="window-destination-rating">
                                        <i className="bi bi-star-fill"></i>
                                        <span>4.92</span>
                                    </div>
                                </div>
                                <p className="window-destination-description">{destination.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
