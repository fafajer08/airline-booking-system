import React, { useState } from 'react';
import GuestDetailsForm from '../components/GuestDetailsForm';
import NavBar from "../components/NavBar";
import { BackButton, ContinueButton } from '../components/Buttons';

function GuestDetailsPage() {
  const [finalGuests, setFinalGuests] = useState([]);

  const handleSubmit = () => {
    console.log("Final Guests: ", finalGuests);
    // Proceed with submission or next steps
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <h5 className="mt-5 ms-5 px-5">Please enter your details</h5>
        <h2 className="ms-5 px-5">Guest Details</h2>
        <GuestDetailsForm setFinalGuests={setFinalGuests} />

        <div>
          <BackButton link="http://localhost:3000/flightoptions" />
          <ContinueButton link="http://localhost:3000/bookingsummary" onClick={handleSubmit} />
        </div>

        <div>
          <h3>Final Guests:</h3>
          <ul>
            {finalGuests.map((guest, index) => (
              <li key={index}>
                {guest.title} {guest.firstName} {guest.lastName}, {guest.day}-{guest.month}-{guest.year} ({guest.age}), {guest.nationality}, {guest.mobileNumber}, {guest.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GuestDetailsPage;
