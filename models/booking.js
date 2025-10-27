const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userNumber: String,
  busNumber: String,
  destination: String,
  passengers: {
    men: Number,
    women: Number,
    children: Number
  },
  totalBill: Number,
  bookingTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
