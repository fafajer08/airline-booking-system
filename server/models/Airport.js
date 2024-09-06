const airportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // E.g., JFK, LAX
    city: { type: String, required: true },
    country: { type: String, required: true }
  });
  
  const Airport = mongoose.model('Airport', airportSchema);
  module.exports = Airport;
  