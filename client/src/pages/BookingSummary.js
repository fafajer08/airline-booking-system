// import Banner from "../components/Banner";
// import Highlights from "../components/Highlights";
// import Course from "../components/Course"
import React from 'react';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';


export default function BookingSummary() {
  return (
    <div>
    <NavBar />
      <div className="container">
        <h5 className="mt-5 ms-5 px-5" > Please review your booking before processing to payment</h5>
        <h2 className="ms-5 px-5">Booking Summary</h2>

        <div>
          <BackButton link="http://localhost:3000/guestdetails" />
          <ContinueButton link="http://localhost:3000/payment" />
        </div>
      </div>
    </div>
  );
}