const mongoose = require('mongoose');

const pastTripSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  city: {
    type: String,
    required: true
  },
  checkIn: {
    type: String,
    required: true
  },
  checkOut: {
    type: String,
    required: true
  },
  preference: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  suggestions: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PastTrip', pastTripSchema); 