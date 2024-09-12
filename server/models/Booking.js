const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true
  },
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger', // Reference to the Passenger schema
    required: true
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight', // Reference to the Flight schema
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment', // Reference to the Payment schema
    required: true
  },
  priceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Price', // Reference to a Price schema (if it exists)
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'], // Valid booking statuses
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now // Automatically set to the current date and time
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
