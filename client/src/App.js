import React from 'react';
import { useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import NavBar from '../src/components/NavBar';
import Home from './pages/Home';

//seach flights pages
import FlightsSearch from './pages/FlightsSearch';
import FlightsOptions from './pages/FlightsOptions';
import FlightsGuests from './pages/FlightsGuests';
import BookingSummary from './pages/BookingSummary';
import Payment from './pages/Payment';
import Test from './pages/Test';
import Destinations from './pages/Destinations';
import LoginPage from './pages/LoginPage';

// admin pages exclusive
import AdminControl from './pages/AdminControl';
import AdminPage from './pages/AdminPage';
import AdminCreate from './pages/AdminCreate';

//logged users exclusive


import Users from './pages/UserDash';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Deals from './pages/Deals';


function App() {
  return (
    <>
      <UserProvider >
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<FlightsSearch />} />
            <Route path="/flights/options" element={<FlightsOptions />} />
            <Route path="/flights/guests" element={<FlightsGuests />} />
            <Route path='/bookings' element={<BookingSummary />} />
            <Route path='/payment' element={<Payment />} />
            <Route path="/test" element={<Test />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/login" element={<LoginPage />} />



            <Route path='/admin/create' element={<AdminCreate />} />
            <Route path='/admin/control' element={<AdminControl />} />
            <Route path='/admin/page' element={<AdminPage />} />
            <Route path='/users' element={<Users />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;




