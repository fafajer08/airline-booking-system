const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: [true, 'Booking ID is required'] },
  paymentDate: { type: Date, required: [true, 'Payment date is required'] },
  amount: { type: Number, required: [true, 'Amount is required'] },
  paymentMethod: { type: String, required: [true, 'Payment method is required'] },
  paymentStatus: { type: String, enum: ['completed', 'pending', 'failed'], required: [true, 'Payment status is required'] }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
