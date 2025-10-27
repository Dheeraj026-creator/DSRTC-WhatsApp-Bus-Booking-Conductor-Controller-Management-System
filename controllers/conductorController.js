const Bus = require("../models/busschema");
const Booking = require("../models/booking");

/* ✅ Render Conductor Login Page */
exports.getConductorPage = (req, res) => {
  if (req.session.authenticatedBus) delete req.session.authenticatedBus;
  res.render("conductor");
};

/* ✅ Verify Bus Credentials (Bus Number + Secret Key) */
exports.verifyBus = async (req, res) => {
  try {
    const { busNumber, secretKey } = req.body;
    const formattedBus = busNumber.trim().toUpperCase().replace(/\s+/g, "");

    const bus = await Bus.findOne({
      busNumber: formattedBus,
      secretKey: secretKey.trim(),
    });

    if (!bus) {
      return res.render("conductor", {
        error: "❌ Invalid Bus Number or Secret Key.",
      });
    }

    // ✅ Store authenticated bus in session
    req.session.authenticatedBus = {
      id: bus._id,
      busNumber: bus.busNumber,
      driverName: bus.driverName,
      bookings: bus.bookings.map((id) => id.toString()),
    };

    console.log(`✅ Conductor authenticated for bus: ${bus.busNumber}`);

    // ⚙️ Important: Ensure session is saved before redirect
    req.session.save((err) => {
      if (err) console.error("❌ Session save error:", err);
      res.redirect("/scanner");
    });
  } catch (err) {
    console.error("❌ verifyBus error:", err);
    res.render("conductor", { error: "⚠️ Server error verifying bus." });
  }
};

/* ✅ Render QR Scanner Page */
exports.getScanner = (req, res) => {
  if (!req.session.authenticatedBus) return res.redirect("/conductor");
  res.render("scanner", { bus: req.session.authenticatedBus });
};

/* ✅ Validate Passenger via Booking ID */
exports.verifyBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const busSession = req.session.authenticatedBus;
    if (!busSession)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const bus = await Bus.findById(busSession.id).populate("bookings");
    if (!bus)
      return res
        .status(404)
        .json({ success: false, message: "Bus not found" });

    const booking = bus.bookings.find(
      (b) => b._id.toString() === bookingId
    );
    if (!booking)
      return res.status(404).json({
        success: false,
        message: "Booking not found for this bus",
      });

    console.log(`🎫 Booking Verified: ${bookingId} for ${bus.busNumber}`);
    res.json({ success: true, message: "Passenger Verified", booking });
  } catch (err) {
    console.error("❌ verifyBooking error:", err);
    res.status(500).json({ success: false });
  }
};

/* ✅ View All Passengers (for that Bus) */
exports.getPassengers = async (req, res) => {
  try {
    const busSession = req.session.authenticatedBus;
    if (!busSession) return res.redirect("/conductor");

    const bus = await Bus.findById(busSession.id).populate("bookings");
    if (!bus)
      return res.render("passengers", {
        passengers: [],
        error: "Bus not found",
      });

    const passengers = bus.bookings.map((b) => ({
      bookingId: b._id,
      destination: b.destination,
      passengers: b.passengers,
      totalBill: b.totalBill,
      bookingTime: b.bookingTime,
    }));

    res.render("passengers", {
      passengers,
      busNumber: bus.busNumber,
    });
  } catch (err) {
    console.error("❌ getPassengers error:", err);
    res.render("passengers", {
      passengers: [],
      error: "Error fetching passenger list",
    });
  }
};

/* ✅ Save Scanned Passenger (Temporary Memory Store) */
let scannedPassengers = [];

exports.savePassenger = (req, res) => {
  try {
    const { bookingId, busNumber, destination, passengers, totalBill, date } =
      req.body;

    scannedPassengers.push({
      bookingId,
      busNumber,
      destination,
      passengers,
      totalBill,
      date,
    });

    console.log("✅ Passenger saved:", { bookingId, destination });
    res.status(200).json({ success: true, passengers: scannedPassengers });
  } catch (err) {
    console.error("❌ savePassenger error:", err);
    res.status(500).json({ success: false });
  }
};
