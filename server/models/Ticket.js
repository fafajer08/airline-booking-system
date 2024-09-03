const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: [true, 'Payment ID is required'] },
  passengerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: [true, 'Passenger ID is required'] },
  seatNo: { type: String, required: [true, 'Seat number is required'] },
  class: { type: String, required: [true, 'Class is required'] },
  ticketPrice: { type: Number, required: [true, 'Ticket price is required'] }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
