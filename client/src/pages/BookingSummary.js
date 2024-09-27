import React, { useEffect } from 'react';  // Import useEffect
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation and useNavigate
import BookingSummaryTable from '../components/BookingSummaryTable';  // Import the BookingSummaryTable component
import { BackButton, ContinueButton } from '../components/Buttons';  // Import BackButton and ContinueButton components
import { Notyf } from 'notyf';  // Import Notyf
import 'notyf/notyf.min.css';   // Import Notyf styles


export default function BookingSummary() {
  const notyf = new Notyf();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, guestEmail } = location.state || {};
  const { user, selectedFlight, promo, finalGuests } = bookingData;
  console.log(`user`, user);

  const totalCost = (
    (selectedFlight.flight.route.distanceKM * selectedFlight.pricing.distanceFactor + selectedFlight.pricing.basePrice)
    * finalGuests.length - 1
  ).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) || 'PHP 0.00';

  useEffect(() => {
    if (!bookingData){
      navigate('/flights');
    }
  })


  useEffect(() => {
    if (!bookingData) {
      console.warn('No booking data found, redirecting...');
      navigate('/flights/guests'); // Redirect to a suitable page if no data
    }
  }, [bookingData, navigate]);

  console.log('Booking data in BookingSummary:', bookingData);



    const handleCreateBooking = () => {
    // Destructure userId and selectedFlightId from data
    // const { userId=null, selectedFlightId, promoId } = data;
    // const { user, selectedFlight, promo, finalGuests } = bookingData;

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
        notyf.success('Guests added successfully');
        console.log('Guests added successfully:', data);
        const passengerIds = data.passengerIds; // Use the passenger IDs from the response


        const bookingData = {
          userId: user?.id || null, // Use userId from destructured data
          passengerIds: passengerIds, // Use the fetched passenger IDs
          commercialFlightId: selectedFlight, // Use selectedFlightId from destructured data
          promoId: promo || null, // Use promoId from destructured data
          seatClass: 'economy'
       
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
        notyf.success('Booking created successfully');
        console.log('Successfully logged booking:', data);
        console.log('guestEmail-booking summary:', guestEmail);
        // Navigate to bookings page
        navigate('/payment', { state: { bookedData: data, totalCost:totalCost, guestEmail:guestEmail } });
    })
    .catch((error) => {
        notyf.error(`Error booking: ${error.message}`);
        console.error('Error booking:', error);
    });
};



  return (
    <div>
      <div className="container">
        <h5>Please review your booking before proceeding to payment</h5>
        <h2>Booking Summary</h2>
        {bookingData && <BookingSummaryTable bookingData={bookingData} />}
        <div>
          <p>By clicking the ‘Continue’ button below, I confirm that I have read, understood, and accept all the conditions set by the airline.</p>
        </div>
        <div className='d-flex'>
          <div className='ms-auto'>
            <BackButton link="/flights/guests" />
            <ContinueButton onClick={handleCreateBooking} /> {/* Now both onClick and link are passed */}
          </div>
        </div>
      </div>
    </div>
  );
}
