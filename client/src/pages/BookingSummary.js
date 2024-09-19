import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import BookingSummaryTable from '../components/BookingSummaryTable'
import { BackButton, ContinueButton } from '../components/Buttons';

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
            <ContinueButton link="/payment" />
          </div>
        </div>
      </div>
    </div>
  );
}
