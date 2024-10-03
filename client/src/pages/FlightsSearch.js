
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFlightButton from "../components/Buttons.js";
import DateSelector from "../components/SelectorDate.js";
import PortSelector from "../components/SelectorPort.js";
import PaxSelector from '../components/SelectorPax.js';
import InputBox from '../components/InputBox.js';
import FlightTypeSelector from "../components/SelectorFlightType.js";
import '../styles/flightsearch.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Spinner } from 'react-bootstrap'; 

export default function SearchFlight() {
  const notyf = new Notyf({ duration: 3000 });
  const navigate = useNavigate();

  // Initialize state from localStorage or defaults
  const [portOptions, setPortOptions] = useState(() => {
    const savedPorts = localStorage.getItem('portOptions');
    return savedPorts ? JSON.parse(savedPorts) : [];
  });

  const [flightType, setFlightType] = useState(() => {
    return localStorage.getItem('flightType') || 'oneway';
  });

  const [departurePort, setDeparturePort] = useState(() => {
    const savedDeparturePort = localStorage.getItem('departurePort');
    return savedDeparturePort ? JSON.parse(savedDeparturePort) : {};
  });

  const [destinationPort, setDestinationPort] = useState(() => {
    const savedDestinationPort = localStorage.getItem('destinationPort');
    return savedDestinationPort ? JSON.parse(savedDestinationPort) : {};
  });

  const [adultsCount, setAdultsCount] = useState(() => {
    return parseInt(localStorage.getItem('adultsCount')) || 0;
  });

  const [childCount, setChildCount] = useState(() => {
    return parseInt(localStorage.getItem('childCount')) || 0;
  });

  const [infantsCount, setInfantsCount] = useState(() => {
    return parseInt(localStorage.getItem('infantsCount')) || 0;
  });

  const [input, setInput] = useState(() => {
    return localStorage.getItem('promoCode') || '';
  });

  const [promoDetails, setPromoDetails] = useState(() => {
    const savedPromoDetails = localStorage.getItem('promoDetails');
    return savedPromoDetails ? JSON.parse(savedPromoDetails) : null;
  });

  const [departureDate, setDepartureDate] = useState(() => {
    return localStorage.getItem('departureDate') || new Date().toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(false);

  const handleFlightTypeChange = (selectedType) => {
    setFlightType(selectedType);
    localStorage.setItem('flightType', selectedType);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (portOptions.length === 0) {
        setLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/flights/airports`);
          const data = await response.json();
          setPortOptions(Array.isArray(data) ? data : []);
          localStorage.setItem('portOptions', JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching airport data:", error);
          notyf.error('Failed to load airport options. Please try again later.');
          setPortOptions([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [portOptions.length, notyf]);

  // Save departurePort to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('departurePort', JSON.stringify(departurePort));
  }, [departurePort]);

  // Save destinationPort to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('destinationPort', JSON.stringify(destinationPort));
  }, [destinationPort]);

  // Save departureDate to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('departureDate', departureDate);
  }, [departureDate]);

  // Save passenger counts to localStorage whenever they change
  useEffect(() => {
    const totalPassengers = adultsCount + childCount + infantsCount;
    localStorage.setItem('noOfPassengers', totalPassengers);
  }, [adultsCount, childCount, infantsCount]);
  

  useEffect(() => {
    localStorage.setItem('adultsCount', adultsCount);
  }, [adultsCount]);

  useEffect(() => {
    localStorage.setItem('childCount', childCount);
  }, [childCount]);

  useEffect(() => {
    localStorage.setItem('infantsCount', infantsCount);
  }, [infantsCount]);

  // Save promo code input to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('promoCode', input);
  }, [input]);

  // Save promoDetails to localStorage whenever it changes
  useEffect(() => {
    if (promoDetails) {
      localStorage.setItem('promoDetails', JSON.stringify(promoDetails));
    } else {
      localStorage.removeItem('promoDetails');
    }
  }, [promoDetails]);

  const handleSearch = async (event) => {
    setLoading(true);
    event.preventDefault();

    let promoData = promoDetails; // Use memoized promoDetails if available

    if (input && !promoData) {
      try {
        const promoResponse = await fetch(`${process.env.REACT_APP_API_URL}/promos/searchpromocode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ promoCode: input }),
        });

        if (!promoResponse.ok) {
          throw new Error(`Promo code error: ${promoResponse.statusText}`);
        }

        promoData = await promoResponse.json();
        setPromoDetails(promoData);
        notyf.success('Promo code applied successfully!');
      } catch (error) {
        console.error("Error fetching promo code:", error);
        setPromoDetails(null);
        notyf.error('Failed to apply promo code.');
      }
    }

    const requestData = {
      departureCode: departurePort.code,
      destinationCode: destinationPort.code,
      defaultDepartureDate: departureDate,
      adults: adultsCount,
      children: childCount,
      infants: infantsCount,
      promoCode: input,
      promo: promoData,
    };

    try {
      const flightResponse = await fetch(`${process.env.REACT_APP_API_URL}/commercialflights/filterbylocation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departureCode: requestData.departureCode,
          destinationCode: requestData.destinationCode,
          departureDate: departureDate,
        }),
      });

      if (!flightResponse.ok) {
        throw new Error(`Flight filter error: ${flightResponse.statusText}`);
      }

      const filteredFlights = await flightResponse.json();

      // Clear localStorage upon successful search
      localStorage.removeItem('departurePort');
      localStorage.removeItem('destinationPort');
      localStorage.removeItem('departureDate');
      localStorage.removeItem('adultsCount');
      localStorage.removeItem('childCount');
      localStorage.removeItem('infantsCount');
      localStorage.removeItem('promoCode');
      //localStorage.removeItem('promoDetails');

      navigate('/flights/options', {
        state: { data: { ...requestData, flightsByLocation: filteredFlights } },
      });
      notyf.success('Flights found successfully!');
    } catch (error) {
      console.error("Error fetching filtered flights:", error);
      notyf.error('No flights found for the selected route.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='search-flight-container my-5'>
      <div className='search-flight-content container'>
        <h1 className="search-flight-heading my-5 mx-5">Where would you like to go?</h1>

        {loading && (
          <div className="d-flex justify-content-center my-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {!loading && (
          <>
            <div className="search-flight-type-selector d-flex align-items-center justify-content-center mb-2">  
              <FlightTypeSelector onFlightTypeChange={handleFlightTypeChange} />
            </div>
            
            <form onSubmit={handleSearch}>
              {flightType === 'oneway' && (
                <div className='search-flight-form-container'>
                  <div className='search-flight-row search-flight-row--oneway'>
                    <PortSelector 
                      portOptions={portOptions}
                      setDeparturePort={setDeparturePort}
                      setDestinationPort={setDestinationPort}
                      departurePort={departurePort} // Pass current value
                      destinationPort={destinationPort} // Pass current value
                    />
                    <DateSelector 
                      label="DEPARTURE DATE" 
                      onDateChange={setDepartureDate}
                      selectedDate={departureDate} // Pass current value
                    />  
                  </div>
                  <div className='search-flight-row search-flight-row--oneway'>
                    <PaxSelector 
                      label={'ADULTS (12+ YEARS)'} 
                      setPaxCount={setAdultsCount}
                      paxCount={adultsCount} // Pass current value
                    />
                    <PaxSelector 
                      label={'CHILDREN (2-11 YEARS)'} 
                      setPaxCount={setChildCount}
                      paxCount={childCount} // Pass current value
                    />
                    <PaxSelector 
                      label={'INFANTS (UNDER 2 YEARS)'} 
                      setPaxCount={setInfantsCount}
                      paxCount={infantsCount} // Pass current value
                    />
                    <InputBox 
                      label="ENTER PROMO CODES" 
                      placeholder="Enter Code" 
                      onChange={setInput}
                      value={input} // Pass current value
                    />
                  </div>
                  <div className='search-flight-submit-btn'>
                    <SearchFlightButton type="submit" />
                  </div>
                </div>
              )}
              {flightType === 'roundtrip' && (
                <div className='search-flight-form-container'>
                  {/* Round-trip form fields */}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
