const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User ID is required'] },
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: [true, 'Flight ID is required'] },
  bookingDate: { type: Date, required: [true, 'Booking date is required'] },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled'], required: [true, 'Booking status is required'] },
  totalPrice: { type: Number, required: [true, 'Total price is required'] }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
