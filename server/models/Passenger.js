const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: [true, 'Booking ID is required'] },
  fName: { type: String, required: [true, 'First name is required'] },
  lName: { type: String, required: [true, 'Last name is required'] },
  passportNo: { type: String, required: [true, 'Passport number is required'] },
  nationality: { type: String, required: [true, 'Nationality is required'] },
  birthDate: { type: Date, required: [true, 'Birth date is required'] }
});

const Passenger = mongoose.model('Passenger', passengerSchema);
module.exports = Passenger;
