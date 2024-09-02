import React from 'react';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';
import GuestDetailsForm from '../components/GuestDetailsForm';

export default function GuestDetails() {
  const initialGuests = [
    { title: '', firstName: '', lastName: '', day: '', month: '', year: '', nationality: '', mobileNumber: '', email: '' },
    { title: '', firstName: '', lastName: '', day: '', month: '', year: '', nationality: '', mobileNumber: '', email: '' },
    // Add more guests as needed
  ];

  return (
    <div>
    <NavBar />
      <div className="container">
        <h5 className="mt-5 ms-5 px-5" > Please enter your details</h5>
        <h2 className="ms-5 px-5">Guest Details</h2>
        <GuestDetailsForm initialGuests={initialGuests} />

        <div>
          <BackButton link="http://localhost:3000/flightoptions" />
          <ContinueButton link="http://localhost:3000/bookingsummary" />
        </div>
      </div>
    </div>
  );
}