// import Banner from "../components/Banner";
// import Highlights from "../components/Highlights";
// import Course from "../components/Course"
import React from 'react';
import NavBar from "../components/NavBar";
import { BackButton, ContinueButton, SubmitButton } from '../components/Buttons';
import BookingSummaryTable from "../components/BookingSummaryTable";


export default function BookingSummary() {
  return (
    <div>
      <div className="container">
        <h5 className="" > Please review your booking before processing to payment</h5>
        <h2 className="">Booking Summary</h2>
        <BookingSummaryTable />
        <div>
        <p>By click ‘Continue’ button below, I confirm that I have read, understood, and accept all the Conditions set by the airline.</p>
        </div>
        <div className='d-flex '>
            <div className='ms-auto'>
              <BackButton link="/flights/guests" />
              <ContinueButton link="/payment" />
            </div>
        </div>
      </div>
    </div>
  );
}