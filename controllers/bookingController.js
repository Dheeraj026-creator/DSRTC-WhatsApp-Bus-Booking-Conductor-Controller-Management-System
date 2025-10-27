const Bus = require("../models/busschema");
const Booking = require("../models/booking");
const QRCode = require("qrcode");
const path = require("path");

/* ✅ Create a new booking (manual or admin side) */
exports.createBooking = async (req, res) => {
  try {
    const { busId, destination, men, women, children } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

    const totalPassengers = Number(men) + Number(women) + Number(children);
    if (bus.availableSeats < totalPassengers)
      return res.status(400).json({ success: false, message: "Not enough seats available" });

    const totalBill = Number(men) * 210 + Number(children) * 110;
    const booking = await Booking.create({
      busNumber: bus.busNumber,
      destination,
      passengers: { men, women, children },
      totalBill,
      bookingTime: new Date(),
    });

    bus.availableSeats -= totalPassengers;
    bus.bookings.push(booking._id);
    await bus.save();

    const qrPath = path.join(__dirname, "../public/qrcodes", `${booking._id}.png`);
    const qrData = `🚌 DSRTC Ticket\nBooking ID: ${booking._id}\nBus: ${bus.busNumber}\nDestination: ${destination}\nPassengers: ${totalPassengers}\nFare: ₹${totalBill}`;
    await QRCode.toFile(qrPath, qrData);

    res.json({ success: true, booking, qrCodePath: `/qrcodes/${booking._id}.png` });
  } catch (err) {
    console.error("❌ createBooking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ✅ Get all bookings (for admin dashboard) */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingTime: -1 });
    res.render("bookings", { bookings });
  } catch (err) {
    console.error("❌ getAllBookings error:", err);
    res.render("bookings", { bookings: [], error: "Error fetching bookings" });
  }
};

/* ✅ Get bookings for a specific bus */
exports.getBusBookings = async (req, res) => {
  try {
    const { busNumber } = req.params;
    const bookings = await Booking.find({ busNumber });
    res.render("bookings", { bookings, busNumber });
  } catch (err) {
    console.error("❌ getBusBookings error:", err);
    res.render("bookings", { bookings: [], error: "Error fetching bus bookings" });
  }
};
