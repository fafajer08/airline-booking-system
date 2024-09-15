const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true, // Ensures booking numbers are unique
  },
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
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment', // Reference to the Payment schema
    required: true
  },
  commercialFlightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommercialFlight', // Reference to the 
    required: true
  },
  promoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promo', // Reference to the 
  },
  seatClass: {
    type: String,
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
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
