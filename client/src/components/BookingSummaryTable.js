import React from 'react';

function BookingSummaryTable() {
    return (
        <div className="booking-summary-table-outer-container container p-5 m-5">
            {/* Flight route and time */}
            <div className="d-flex justify-content-between flight-summary px-5 mx-5 mb-5">
                <div className="flight-route">
                    <div>DVO-MNL via CEB</div>
                    <div>27 Aug 2024 05:00 AM - 6:20 AM</div>
                </div>
                <div className="toggle-details">Hide flight details</div>
            </div>

            {/* Flight details */}
            <div className="flight-details px-5 mx-5 mb-5">
                <div className="flight-info d-flex mb-5">
                    <div className="pe-5">
                        <div>27 Aug 2024</div>
                        <div>05:00 AM</div>
                    </div>
                    <div>
                        <div>DEPARTURE - FLIGHT NO SX 460</div>
                        <div>DAVAO - Francisco Bangoy International Airport</div>
                    </div>
                </div>
                <div className="flight-info d-flex mb-5">
                    <div className="pe-5">
                        <div>27 Aug 2024</div>
                        <div>06:20 AM</div>
                    </div>
                    <div>
                        <div>ARRIVAL - FLIGHT NO SX 460</div>
                        <div>MANILA - Ninoy Aquino International Airport</div>
                    </div>
                </div>
            </div>

            {/* Passenger information */}
            <div className="passenger-info px-5 mx-5 mb-5">
                <h5>Juan Dela Cruz</h5>
            </div>

            {/* Total cost */}
            <div className="d-flex justify-content-between total-summary px-5 mx-5">
                <h4>Total</h4>
                <h4 className=''>PHP 7,500</h4>
            </div>
        </div>
    );
}

export default BookingSummaryTable;
