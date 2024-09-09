const scheduleSchema = new mongoose.Schema({
    dayOfWeek: { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], required: true },
    departureTime: { type: String, required: true }, // Use a string to store "HH:mm" time format
    arrivalTime: { type: String, required: true },
    // Optionally store date-specific overrides
    departureDate: { type: Date },  // If you need date-specific overrides
  });
  
  const Schedule = mongoose.model('Schedule', scheduleSchema);
  module.exports = Schedule;
  