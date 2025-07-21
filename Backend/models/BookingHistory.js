const mongoose = require('mongoose');

const bookingHistorySchema = new mongoose.Schema({
  vehicle: String,
  name: String,
  phone: String,
  type: String,
  slot: Number,
  bookingId: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  deletedByManager: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
});

module.exports = mongoose.model('BookingHistory', bookingHistorySchema);
