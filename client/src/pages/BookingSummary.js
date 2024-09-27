
import React, { useEffect, useState } from 'react';  // Import useEffect and useState
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation and useNavigate
import BookingSummaryTable from '../components/BookingSummaryTable';  // Import the BookingSummaryTable component
import { BackButton, PayButton } from '../components/Buttons';  // Import BackButton and ContinueButton components
import { Notyf } from 'notyf';  // Import Notyf
import 'notyf/notyf.min.css';   // Import Notyf styles
import { Spinner } from 'react-bootstrap'; 

export default function BookingSummary() {
  const notyf = new Notyf();
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData, guestEmail } = location.state || {};
  const { user, selectedFlight, promo, finalGuests } = bookingData;
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);  // Add payment processing state
  
  const totalCost = (
    50 * (selectedFlight.flight.route.distanceKM * selectedFlight.pricing.distanceFactor + selectedFlight.pricing.basePrice)
    * finalGuests.length - 1
  );

  useEffect(() => {
    if (!bookingData) {
      navigate('/flights');
      setIsLoading(false);  ///////
    }
  }, [bookingData, navigate]);

  // Payment redirection handling
  const handlePaymentRedirect = (url) => {
    window.open(url, '_blank');
    setIsPaymentProcessing(true);  // Start payment processing
  };

  const handlePayment = () => {
    setIsLoading(true);  // Start loading when initiating payment
    const url = 'https://api.paymongo.com/v1/links';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic c2tfdGVzdF9pSmU0VWFGR3Z2N2szMUZwbUNCUFhZdjY6'
      },
      body: JSON.stringify({ data: { attributes: { amount: totalCost, description: 'ticket' } } })
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        handlePaymentRedirect(json.data.attributes.checkout_url);

        const statusCheckUrl = `https://api.paymongo.com/v1/links/${json.data.id}`;
        const statusOptions = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            authorization: 'Basic c2tfdGVzdF9pSmU0VWFGR3Z2N2szMUZwbUNCUFhZdjY6'
          }
        };

        // Poll for the payment status
        const checkPaymentStatus = () => {
          fetch(statusCheckUrl, statusOptions)
            .then(res => res.json())
            .then(res => {
              console.log('response: ',res);

              if (res.data.attributes.status === "paid") {

                console.log('bookind data to ticket ', bookingData);


                navigate('/ticket', { state: { bookingData, totalCost, guestEmail } });
                setIsLoading(false);
                //setIsPaymentProcessing(false);  // Stop payment processing
              } else if (res.data.attributes.status === "disrupted") {
                navigate('/bookings');
                setIsLoading(false);
                //setIsPaymentProcessing(false);  // Stop payment processing
              } else {
                // If not completed, check again after a delay
                setTimeout(checkPaymentStatus, 1000);  // Poll every 3 seconds
              }
            })
            .catch(err => {
              console.error('error:', err);
              setIsLoading(false);
              setIsPaymentProcessing(false);  // Stop loading on error
            });
        };

        // Start polling the payment status
        checkPaymentStatus();
      })
      .catch(err => {
        console.error('error:', err);
        setIsLoading(false);  // Stop loading on error
      });
  };

  const handleCreateBooking = () => {
    const guestsToSubmit = finalGuests.slice(0, -1).map((guest) => {
      const birthday = guest.year && guest.month && guest.day
        ? `${guest.year}-${String(guest.month).padStart(2, '0')}-${String(guest.day).padStart(2, '0')}`
        : '';
      return {
        ...guest,
        birthday,
      };
    });

    if (guestsToSubmit.length === 0) {
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/passengers/addmultiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ passengers: guestsToSubmit }),
    })
      .then((response) => response.json())
      .then((data) => {
        const passengerIds = data.passengerIds;
        const bookingData = {
          userId: user?.id || null,
          passengerIds,
          commercialFlightId: selectedFlight,
          promoId: promo || null,
          seatClass: 'economy'
        };
        return fetch(`${process.env.REACT_APP_API_URL}/bookings/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(bookingData),
        });
      })
      .then(() => {
        handlePayment();
      })
      .catch((error) => {
        notyf.error(`Error booking: ${error.message}`);
      });
  };

  return (
    <div>
      <div className="container">
        {isLoading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div> // Show loading indicator
        )}
        <h5>Please review your booking before proceeding to payment</h5>
        <h2>Booking Summary</h2>
        {bookingData && <BookingSummaryTable bookingData={bookingData} />}
        <div>
          <p>By clicking the ‘Continue’ button below, I confirm that I have read, understood, and accept all the conditions set by the airline.</p>
        </div>
        <div className='d-flex'>
          <div className='ms-auto'>
            <BackButton link="/flights/guests" />
            {!isLoading && (
                <PayButton onClick={handleCreateBooking} disabled={isPaymentProcessing} />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
