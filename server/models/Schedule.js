const scheduleSchema = new mongoose.Schema({
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    dayOfWeek: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
    departureTime: { type: String, required: true }, // Use a string to store "HH:mm" time format
    arrivalTime: { type: String, required: true },
    // Optionally store date-specific overrides
    departureDate: { type: Date },  // If you need date-specific overrides
    status: { type: String, enum: ['ontime', 'delayed', 'cancelled'], default: 'ontime' }
  });
  
  const Schedule = mongoose.model('Schedule', scheduleSchema);
  module.exports = Schedule;
  