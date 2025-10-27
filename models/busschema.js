const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true, trim: true },
  driverName: { type: String, required: true, trim: true },
  driverPhone: { type: String, required: true, match: [/^\d{10}$/, 'Enter valid 10-digit number'] },
  totalSeats: { type: Number, required: true, min: 1 },
  availableSeats: { type: Number, required: true, min: 0 },

  departureCity: { type: String, required: true, trim: true },
  departureTime: { type: String, required: true },
  arrivalCity: { type: String, required: true, trim: true },
  arrivalTime: { type: String, required: true },

  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }],

  // ✅ Secret key field
  secretKey: { type: String, required: true, trim: true ,unique:true},

  createdAt: { type: Date, default: Date.now }
});
busSchema.pre('save', function (next) {
  const padTime = (time) => {
    if (!time) return time;
    const [h, m] = time.split(':').map(Number);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };
  this.departureTime = padTime(this.departureTime);
  this.arrivalTime = padTime(this.arrivalTime);
  next();
});
module.exports = mongoose.model("Bus", busSchema);
