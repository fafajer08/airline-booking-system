import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/notfound.css'; // Import the CSS file

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404 - Page Not Found</h1>
            <button className="not-found-button" onClick={() => navigate('/')}>
                Go Back Home
            </button>
        </div>
    );
}

export default NotFound;
