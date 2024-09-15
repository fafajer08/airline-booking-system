const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isActive: {
   type: Boolean,
    default: true
  }
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;