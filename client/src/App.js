import React from 'react';
import { useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import NavBar from '../src/components/NavBar';
import Home from './pages/Home';
import SearchFlight from './pages/SearchFlight';
import FlightOptions from './pages/FlightOptions';
import GuestDetails from './pages/GuestDetails';
import BookingSummary from './pages/BookingSummary';
import Payment from './pages/Payment';
import Test from './pages/Test';
import Destinations from './pages/Destinations';
import LoginPage from './pages/LoginPage';
import Admin from './pages/AdminDash';
import Users from './pages/UserDash';
import NotFound from './pages/NotFound';


function App() {
  return (
    <>
      <UserProvider >
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/searchflight" element={<SearchFlight />} />
            <Route path="/flightoptions" element={<FlightOptions />} />
            <Route path="/guestdetails" element={<GuestDetails />} />
            <Route path='/bookingsummary' element={<BookingSummary />} />
            <Route path='/payment' element={<Payment />} />
            <Route path="/test" element={<Test />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/users' element={<Users />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;




