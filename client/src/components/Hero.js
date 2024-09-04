import React, { useState } from "react";
import "../styles/hero.css"; 
// import  'bootstrap-icons/font/bootstrap-icons.css';


const HeroSection = () => {

  const [departureAirport, setDepartureAirport] = useState({
    cityName: '',
    airportCode: '',
    airportName: ''
  });





  const [formType, setFormType] = useState('round-trip');

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Explore the World</h1>
        <p>Find the best deals on flights and destinations</p>
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
                      {/* Add more options as needed */}
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
                      {/* Add more options as needed */}
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
              {/* <PortSelector  label="DEPARTURE AIRPORT"  selectedPort={departureAirport} setSelectedPort={setDepartureAirport}  />
              <DateSelector label="DEPARTURE DATE" /> */}

              {/* Search Flight Button */}
              <div className="btn-container d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary btn-search">
                  Search Flights <i className="bi bi-search ms-2"></i>
                </button>
              </div>

              
            </form>

          </div>
        </div>
      </div>
    </section>

  );
};

export default HeroSection;


// import React, { useState } from 'react';
// import planeUp from '../assets/planeup.png';
// import division from '../assets/division.png';
// import dropDownIcon from '../assets/dropdowngray.png';
// import swapIcon from '../assets/swapicon.png';
// import DateSelector from './DateSelector'; // Adjust path if needed
// import PortSelector from './PortSelector';

// const HeroSection = () => {
//   const [formType, setFormType] = useState('one-way');

//   return (
//     <section className="hero">
//       <div className="hero-content">
//         <h1>Explore the World</h1>
//         <p>Find the best deals on flights and destinations</p>
//         <div className="form-container">
//           <div className="button-group">
//             <button
//               className={`trip-btn ${formType === 'one-way' ? 'active' : ''}`}
//               onClick={() => setFormType('one-way')}
//             >
//               One Way
//             </button>
//             <button
//               className={`trip-btn ${formType === 'round-trip' ? 'active' : ''}`}
//               onClick={() => setFormType('round-trip')}
//             >
//               Round Trip
//             </button>
//             <button
//               className={`trip-btn ${formType === 'multi-city' ? 'active' : ''}`}
//               onClick={() => setFormType('multi-city')}
//             >
//               Multi City
//             </button>
//           </div>

//           <div className="search-form-wrapper">
//             <div className="flight-search container d-flex">
//               <div className="departure-search airport-select box">
//                 <p>DEPARTURE AIRPORT</p>
//                 <div>
//                   <img className="plane-icon" src={planeUp} alt="plane departing" />
//                   <div className="departure-port-code">DVO</div>
//                   <img src={division} alt="division icon" />
//                   <PortSelector />
//                 </div>
//                 <img src={dropDownIcon} alt="dropdown icon" />
//               </div>

//               <div>
//                 <img className="swap-icon" src={swapIcon} alt="swap departure and arrival locations" />
//               </div>

//               <div className="return-search airport-select box">
//                 <p>ARRIVAL AIRPORT</p>
//                 <div>MNL</div>
//               </div>

//               <div className="departure-date box">
//                 <p>DEPARTURE DATE</p>
//                 <div className="cont">
//                   <DateSelector />
//                 </div>
//               </div>

//               {formType !== 'one-way' && (
//                 <div className="return-date box">
//                   <p>RETURN DATE</p>
//                   <input type="date" className="form-control" id="returnDate" />
//                 </div>
//               )}
//             </div>

//             <div className="btn-container d-flex justify-content-center mt-3">
//               <button type="submit" className="btn btn-primary btn-search">
//                 Search Flights <i className="bi bi-search ms-2"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

