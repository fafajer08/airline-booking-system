const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: [true, 'Booking ID is required'] 
  },
  paymentDate: { 
    type: Date, 
    required: [true, 'Payment date is required'],
    default: Date.now 
  }, 
  amount: { 
    type: Number, 
    required: [true, 'Amount is required'] 
  },
  paymentMethod: { 
    type: String, 
    required: [true, 'Payment method is required'] 
  },
  isPaid: { 
    type: Boolean, 
    required: true, 
    default: false },
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'refund'], 
    default: 'paid'}
},  {
  timestamps: true, // Adds createdAt and updatedAt fields
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
  