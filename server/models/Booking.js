const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    // required: true,  // To allow unregistered users to still book;
  },
  passengerIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Passenger' // Reference to the Passenger schema
    },
  ],
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment', // Reference to the Payment schema
    default: null,
  },
  commercialFlightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommercialFlight', // Reference to the CommercialFlight schema
    required: true,
  },
  promoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promo', // Reference to the Promo schema
    default: null,
  },
  seatClass: {
    type: String,
    required: true,
  },

  fare: {
    type: Number,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'], // Valid booking statuses
    default: 'pending',
  },
  bookingDate: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
