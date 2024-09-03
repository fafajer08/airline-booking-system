const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNo: { type: String, required: [true, 'Flight number is required'] },
  departureTime: { type: Date, required: [true, 'Departure time is required'] },
  arrivalTime: { type: Date, required: [true, 'Arrival time is required'] },
  flightStatus: { type: String, enum: ['ontime', 'delayed', 'cancelled'], required: [true, 'Flight status is required'] }
});

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
