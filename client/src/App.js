import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SearchFlight from './pages/SearchFlight';
import FlightOptions from './pages/FlightOptions';
import GuestDetails from './pages/GuestDetails';
import BookingSummary from './pages/BookingSummary';
import Payment from './pages/Payment';
import Test from './pages/Test';
import Destinations from './pages/Destinations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searchflight" element={<SearchFlight />} />
        <Route path="/flightoptions" element={<FlightOptions />} />
        <Route path="/guestdetails" element={<GuestDetails />} />
        <Route path='bookingsummary' element={<BookingSummary />} />
        <Route path='payment' element={<Payment />} />
        <Route path="/test" element={<Test />} />
        <Route path="/destinations" element={<Destinations />} />
      </Routes>
    </Router>
  );
}

export default App;




