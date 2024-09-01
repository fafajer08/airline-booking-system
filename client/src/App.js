import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SearchFlight from './pages/SearchFlight';
import FlightOptions from './pages/FlightOptions';
import GuestDetails from './pages/GuestDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchflight" element={<SearchFlight />} />
        <Route path="/flightoptions" element={<FlightOptions />} />
        <Route path="/guestdetails" element={<GuestDetails />} />
      </Routes>
    </Router>
  );
}

export default App;




