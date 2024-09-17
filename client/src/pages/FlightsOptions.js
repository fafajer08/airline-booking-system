// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import NavBar from "../components/NavBar";
// import Carousel from "../components/Carousel";
// import { BackButton, ContinueButton } from '../components/Buttons';
// import FlightTable from "../components/FlightTable";

// export default function FlightOptions() {
//   const location = useLocation();
//   const { data } = location.state; // Retrieve data passed via navigate
//   const [filteredFlights, setFilteredFlights] = useState(data.flights); // Store selected flights

//   // Callback function to handle date selection in the carousel
//   const handleDateSelection = (selectedDate) => {
//     const filteredFlights = data.flights.filter(flight => {
//       const flightDate = new Date(flight.departureDate).toDateString();
//       console.log(`flightDate: ${flightDate}`);
//       return flightDate === selectedDate.toDateString();
//     });
//     setFilteredFlights(filteredFlights);
//     console.log(`filteredFlights: ${JSON.stringify(filteredFlights)}`);
//   };

//   return (
//     <div>
//       <div className="container">
//         <h5 className="mt-5 ms-5 px-5">Select your flight</h5>
//         <h2 className="ms-5 px-5">{data.departureCode} bound for {data.destinationCode}</h2>
//         {/* Pass data and handleDateSelection callback to Carousel */}
//         <Carousel flights={data.flights} departureDate={data.departureDate} onDateSelect={handleDateSelection} />
//         <FlightTable flights={filteredFlights} /> {/* Pass selected flights to FlightTable */}
//         <div className="button-container m-4">
//           <BackButton link="/flights" /> 
//           <ContinueButton link="/flights/guests" /> 
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';
import FlightTable from "../components/FlightTable";

export default function FlightOptions() {
  const location = useLocation();
  const { data } = location.state; // Retrieve data passed via navigate
  const [selectedFlights, setSelectedFlights] = useState(data.flights); // Store selected flights
  const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date

  // Callback function to handle date selection in the carousel
  const handleDateSelection = (date) => {
    setSelectedDate(date); // Update selectedDate state
    const formattedDate = date.toISOString().split('T')[0];
    
    // Filter flights based on selected date
    const filteredFlights = data.flights.filter(flight => flight.date === formattedDate);
    setSelectedFlights(filteredFlights); // Update state with filtered flights
    
    console.log(`Selected Date: ${formattedDate}`); // Print selected date
    console.log(`Filtered Flights:`, filteredFlights); // Log filtered flights directly
  };

  return (
    <div>
      <div className="container">
        <h5 className="mt-5 ms-5 px-5">Select your flight</h5>
        <h2 className="ms-5 px-5">{data.departureCode} bound for {data.destinationCode}</h2>
        {/* Pass data and handleDateSelection callback to Carousel */}
        <Carousel flights={data.flights} departureDate={data.departureDate} onDateSelect={handleDateSelection} />
        <FlightTable selectedFlights={selectedFlights} /> {/* Pass selected flights to FlightTable */}
        <div className="button-container m-4">
          <BackButton link="/flights" /> 
          <ContinueButton link="/flights/guests" /> 
        </div>
      </div>
    </div>
  );
}
