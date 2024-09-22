import React, { useState, useEffect } from 'react';
import GuestDetailsForm from '../components/GuestDetailsForm';
import { BackButton, ContinueButton } from '../components/Buttons';
import { useLocation, useNavigate } from 'react-router-dom';

function GuestDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {}; 
  const [finalGuests, setFinalGuests] = useState([]);
  const [passengerIds, setPassengerIds] = useState([]);

  const { user, selectedFlight, promo } = data;

  console.log(`flight guest recieved user: ` , user);
  console.log(`flight guest recieved selectedflight: `, selectedFlight);
  console.log(`flight guest recieved promo: ` , promo);

  useEffect(() => { if(!data) {
    navigate('/flights/options');
    return null; // Exit early if no data is provided
  }});
 

  const handleSubmit = () => {
    // Destructure userId and selectedFlightId from data
    // const { userId=null, selectedFlightId, promoId } = data;
    const { user, selectedFlight, promo } = data;

    // Exclude the last guest from the list and format their birthday
    const guestsToSubmit = finalGuests.slice(0, -1).map((guest) => {
        const birthday = guest.year && guest.month && guest.day
            ? `${guest.year}-${String(guest.month).padStart(2, '0')}-${String(guest.day).padStart(2, '0')}`
            : '';

        return {
            ...guest,
            birthday,
        };
    });

    console.log('Guests to Submit: ', guestsToSubmit);

    if (guestsToSubmit.length === 0) {
        console.log('No guests to submit');
        return;
    }

    // Submit passengers first
    fetch(`${process.env.REACT_APP_API_URL}/passengers/addmultiple`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ passengers: guestsToSubmit }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to add guests');
        }
        return response.json();
    })
    .then((data) => {
        console.log('Guests added successfully:', data);
        const passengerIds = data.passengerIds; // Use the passenger IDs from the response

        // Prepare booking data after successfully getting passenger IDs
        // const bookingData = {
        //     user: user, // Use userId from destructured data
        //     passengerIds: passengerIds, // Use the fetched passenger IDs
        //     commercialFlightId: selectedFlightId, // Use selectedFlightId from destructured data
        //     promo: promo || null, // Use promoId from destructured data
        //     seatClass: 'economy',
        // };

        const bookingData = {
          userId: user, // Use userId from destructured data
          passengerIds: passengerIds, // Use the fetched passenger IDs
          commercialFlightId: selectedFlight, // Use selectedFlightId from destructured data
          promoId: promo || null, // Use promoId from destructured data
          seatClass: 'economy',
      };


        console.log('Booking data to submit:', bookingData);

        // Make the booking
        return fetch(`${process.env.REACT_APP_API_URL}/bookings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(bookingData), // Pass the correct booking data object
        });
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to add booking data');
        }
        return response.json();
    })
    .then((data) => {
        console.log('Successfully logged booking:', data);
        // Navigate to bookings page
        navigate('/bookings', { state: { bookingData: data } });
    })
    .catch((error) => {
        console.error('Error booking:', error);
    });
};



  return (
    <div>
      <div className="container">
        <h5 className="mt-5 ms-5 px-5">Please enter your details</h5>
        <h2 className="ms-5 px-5">Guest Details</h2>
        <GuestDetailsForm setFinalGuests={setFinalGuests} />

        <div>
          <BackButton link="/flights/options" />
          <ContinueButton onClick={handleSubmit} />
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
