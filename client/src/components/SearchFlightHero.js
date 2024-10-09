

import React, { useState, useEffect, useCallback, useRef } from "react"; 
import { useNavigate } from 'react-router-dom';
import PortSelector from "../components/SelectorPort"; // Single PortSelector component
import DateSelector from "../components/SelectorDate.js"; // DateSelector component
import { SubmitButton } from '../components/Buttons'; // SubmitButton component
import '../styles/searchflighthero.css'; // Ensure appropriate styling is applied
import { Notyf } from 'notyf'; // For user notifications
import 'notyf/notyf.min.css'; // Notyf CSS

export default function SearchFlightHero() {
    const navigate = useNavigate();

    // Initialize Notyf for notifications using useRef to maintain a stable instance
    const notyf = useRef(new Notyf({
        duration: 3000,
        position: { x: 'right', y: 'top' },
    }));

    // State to manage trip type
    const [formType, setFormType] = useState('round-trip'); // Options: 'one-way', 'round-trip', 'multi-city'

    // State for ports and dates
    const [departurePort, setDeparturePort] = useState(null);
    const [destinationPort, setDestinationPort] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);

    // State for port options, loading, and error
    const [portOptions, setPortOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetch airport data from the API.
     * Caches data in localStorage to avoid redundant fetches.
     */
    const fetchAirportData = useCallback(async () => {
        try {

                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/airports`);
                if (!response.ok) {
                    throw new Error(`Error fetching airports: ${response.statusText}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setPortOptions(data);
                    localStorage.setItem('portOptions', JSON.stringify(data));
                } else {
                    throw new Error('Invalid data format received for ports.');
                }
        
        } catch (err) {
            console.error(err);
            setError('Failed to load airport options. Please try again later.');
            notyf.current.error('Failed to load airport options. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch airport data on component mount
    useEffect(() => {
        fetchAirportData();
    }, [fetchAirportData]);

    /**
     * Handle form submission.
     * Validates inputs and navigates to the /flights route with search parameters.
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form inputs
        if (!departurePort || !destinationPort) {
            notyf.current.error('Please fill in all required fields.');
            return;
        }

        // Store selected ports in localStorage
        localStorage.setItem('departurePort', JSON.stringify(departurePort));
        localStorage.setItem('destinationPort', JSON.stringify(destinationPort));


        // if (formType !== 'one-way' && !returnDate) {
        //     notyf.current.error('Please select a return date for Round Trip or Multi City.');
        //     return;
        // }

        // Ensure departure and arrival ports are different
        if (departurePort.code === destinationPort.code) {
            notyf.current.error('Departure and Arrival cities cannot be the same.');
            return;
        }

        // Prepare search parameters
        const searchParams = {
            tripType: formType,
            departurePort,
            destinationPort,
            departureDate,
            returnDate: formType === 'one-way' ? null : returnDate,
        };

        // Option 1: Pass data via state using React Router's navigate
        // navigate('/flights', { state: { data: searchParams } });

        navigate('/flights', {
            state: { 
                departurePort,
                destinationPort,
                departureDate,
                returnDate
            }
        });

        // Option 2: Alternatively, save to localStorage and navigate (commented out)
        // localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));
        // navigate('/flights');
    };

    // Render loading state
    if (loading) {
        return (
            <div className="search-flight-hero">
                <div className="form-container">
                    <p>Loading airport options...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="search-flight-hero">
                <div className="form-container">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-flight-hero">
            <div className="form-container">
                {/* Trip Type Selection */}
                <div className="button-container">
                    <div className="button-group">
                        {/* <button
                            type="button"
                            className={`trip-btn ${formType === 'one-way' ? 'active' : ''}`}
                            onClick={() => setFormType('one-way')}
                        >
                            One Way
                        </button> */}
                        {/* <button
                            type="button"
                            className={`trip-btn ${formType === 'round-trip' ? 'active' : ''}`}
                            onClick={() => setFormType('round-trip')}
                        >
                            Round Trip
                        </button>
                        <button
                            type="button"
                            className={`trip-btn ${formType === 'multi-city' ? 'active' : ''}`}
                            onClick={() => setFormType('multi-city')}
                        >
                            Multi City
                        </button> */}
                    </div>
                </div>

                {/* Search Form */}
                <div className="search-form-wrapper">
                    <form className="search-form" onSubmit={handleSubmit}>
                        <div className="row row-cols-1 row-cols-md-4 g-3">
                            {/* Port Selector (Handles Both Departure and Arrival) */}
                            <div className="col-12">
                                <PortSelector
                                    portOptions={portOptions}
                                    setDeparturePort={setDeparturePort}
                                    setDestinationPort={setDestinationPort}
                                />
                            </div>

                            {/* Departure Date Selector */}
                            {/* <div className="col">
                                <DateSelector
                                    label="Departure Date"
                                    selectedDate={departureDate}
                                    onDateChange={setDepartureDate}
                                />
                            </div> */}

                            {/* Return Date Selector (Conditional) */}
                            {/* {formType !== 'one-way' && (
                                <div className="col">
                                    <DateSelector
                                        label="Return Date"
                                        selectedDate={returnDate}
                                        onDateChange={setReturnDate}
                                    />
                                </div>
                            )} */}
                        </div>

                        {/* Search Flights Button */}
                        <div className="btn-container d-flex justify-content-center mt-4">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

