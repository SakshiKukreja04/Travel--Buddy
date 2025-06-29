const mongoose = require('mongoose');

const pastTripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  city: String,
  checkIn: String,
  checkOut: String,
  preference: String,
  budget: Number,
  suggestions: Object
}, { timestamps: true });

module.exports = mongoose.model('PastTrip', pastTripSchema); 