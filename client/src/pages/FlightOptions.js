import React from 'react';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton } from '../components/Buttons';
import FlightTable from "../components/FlightTable";

export default function FlightOptions() {
  return (
    <div>
      <div className="container">
        <h5 className="mt-5 ms-5 px-5">Select your flight</h5>
        <h2 className="ms-5 px-5">Davao DVO bound for Manila MNL</h2>
        <Carousel />
        <FlightTable />
        <div className="button-container m-4">
          <BackButton link="http://localhost:3000/searchflight" />
          <ContinueButton  link="http://localhost:3000/guestdetails" />
        </div>
      </div>
    </div>
  );
}
