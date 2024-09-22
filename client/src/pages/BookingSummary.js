import React, { useEffect } from 'react';  // Import useEffect
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation and useNavigate
import BookingSummaryTable from '../components/BookingSummaryTable';  // Import the BookingSummaryTable component
import { BackButton, ContinueButton } from '../components/Buttons';  // Import BackButton and ContinueButton components


export default function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  useEffect(() => {
    if (!bookingData) {
      console.warn('No booking data found, redirecting...');
      navigate('/flights/guests'); // Redirect to a suitable page if no data
    }
  }, [bookingData, navigate]);

  console.log('Booking data in BookingSummary:', bookingData);

  const handleContinue = () => {
    console.log('Continue clicked! Review has been accepted.');
    // Any additional logic before navigating
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
            <ContinueButton onClick={handleContinue} link="/payment" /> {/* Now both onClick and link are passed */}
          </div>
        </div>
      </div>
    </div>
  );
}
