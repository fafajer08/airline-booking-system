// import Banner from "../components/Banner";
// import Highlights from "../components/Highlights";
// import Course from "../components/Course"
import React from 'react';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton, SubmitButton } from '../components/Buttons';


export default function Payment() {
  return (
    <div>
    <NavBar />
      <div className="container">
        <h5 className="mt-5 ms-5 px-5" > How would you like to pay?</h5>
        <h2 className="ms-5 px-5">Payment Method</h2>

        <div>
          <BackButton link="http://localhost:3000/bookingsummary" />
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}