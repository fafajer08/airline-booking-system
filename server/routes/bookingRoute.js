// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController'); // Adjust the path as needed

// Route to add a new booking
router.post('/', bookingController.addBooking);

// Route to get booking details by ID
router.get('/:id', bookingController.getBookingDetails);

// Route to update booking status (e.g., confirm, cancel)
router.patch('/:id/status', bookingController.updateBookingStatus);

// Route to view all bookings
router.get('/', bookingController.viewAllBookings);

module.exports = router;
