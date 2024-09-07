const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fName: { type: String, required: [true, 'First name is required'] },
  lName: { type: String, required: [true, 'Last name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'] },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
