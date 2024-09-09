import React, { useState } from "react";
import SelectorPort from "../components/SelectorPort";

export default function SearchFlightHero() {

    const [formType, setFormType] = useState('round-trip');

    return (
        <div className="form-container">
        <div className="button-container">
        <div className="button-group">
            <button
            className={`trip-btn ${formType === 'one-way' ? 'active' : ''}`}
            onClick={() => setFormType('one-way')}
            >
            One Way
            </button>
            <button
            className={`trip-btn ${formType === 'round-trip' ? 'active' : ''}`}
            onClick={() => setFormType('round-trip')}
            >
            Round Trip
            </button>
            <button
            className={`trip-btn ${formType === 'multi-city' ? 'active' : ''}`}
            onClick={() => setFormType('multi-city')}
            >
            Multi City
            </button>
        </div>
        </div>

        <div className="search-form-wrapper">
        <form className="search-form">
            <div className="row row-cols-1 row-cols-md-4">
            <div className="col">
                <label htmlFor="departureCity" className="form-label">Departure City</label>
                <div className="input-wrapper">
                <input
                    type="text"
                    className="form-control"
                    id="departureCity"
                    list="departureCities"
                    placeholder="DVO Davao"
                />
                <datalist id="departureCities">
                    <option value="DVO Davao">
                    Davao International Airport
                    </option>
                    <option value="MNL Manila">
                    Ninoy Aquino International Airport
                    </option>

                </datalist>
                </div>
            </div>

            <div className="col">
                <label htmlFor="arrivalCity" className="form-label">Arrival City</label>
                <div className="input-wrapper">
                <input
                    type="text"
                    className="form-control"
                    id="arrivalCity"
                    list="arrivalCities"
                    placeholder="MNL Manila"
                />
                <datalist id="arrivalCities">
                    <option value="MNL Manila">
                    Ninoy Aquino International Airport
                    </option>
                    <option value="DVO Davao">
                    Davao International Airport
                    </option>

                </datalist>
                </div>
            </div>

            <div className="col">
                <label htmlFor="departureDate" className="form-label">Departure Date</label>
                <input type="date" className="form-control" id="departureDate" />
            </div>
            {formType !== 'one-way' && (
                <div className="col">
                <label htmlFor="returnDate" className="form-label">Return Date</label>
                <input type="date" className="form-control" id="returnDate" />
                </div>
            )}
            </div>


  
            <div className="btn-container d-flex justify-content-center mt-3">
            <button type="submit" className="btn btn-primary btn-search">
                Search Flights <i className="bi bi-search ms-2"></i>
            </button>
            </div>

            
        </form>

        </div>
        </div>
    )
}