const crypto = require("crypto");
const path = require("path");
const QRCode = require("qrcode");
const Bus = require("../models/busschema");
const Booking = require("../models/booking");
const razorpay = require("../config/razorpay");
const { sendWhatsAppMessage } = require("../config/whatsapp");

const sessions = {}; // shared user sessions (import same in whatsapp controller)
const PUBLIC_URL = process.env.PUBLIC_URL || "";

/* ✅ Razorpay Payment Page */
exports.getPaymentPage = (req, res) => {
  res.render("payment", {
    orderId: req.params.orderId,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  });
};

/* ✅ Razorpay Webhook */
exports.webhook = async (req, res) => {
  console.log("\n--- ✅ RAZORPAY WEBHOOK RECEIVED ---");

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // 🔒 Verify signature (req.body is a Buffer)
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.error("❌ Invalid Razorpay signature");
      return res.status(400).json({ success: false });
    }

    // ✅ Parse event body AFTER verification
    const bodyString = req.body.toString();
    const parsed = JSON.parse(bodyString);
    const event = parsed.event;

    if (event === "payment.captured") {
      const payment = parsed.payload.payment.entity;
      const orderId = payment.order_id;

      // 🔎 Find user session using orderId
      const userSession = Object.values(sessions).find(
        (s) => s.paymentOrderId === orderId
      );
      if (!userSession) {
        console.error("❌ No matching session for order ID:", orderId);
        return res.json({ success: false });
      }

      const { selectedBus: bus, destination, passengers: pax, totalBill } =
        userSession;
      const totalPassengers = pax.men + pax.women + pax.children;

      // 🚌 Update bus seat count
      const foundBus = await Bus.findById(bus._id);
      if (foundBus) {
        foundBus.totalSeats -= totalPassengers;
        await foundBus.save();
      }

      // 💾 Create booking document FIRST
      const booking = await Booking.create({
        busNumber: bus.busNumber,
        destination,
        passengers: pax,
        totalBill,
        bookingTime: new Date(),
      });

      // 🔗 Link booking to bus
      if (foundBus) {
        foundBus.bookings.push(booking._id);
        await foundBus.save();
      }

      // 🎫 Generate QR code
      const qrFilePath = path.join(
        __dirname,
        "../public/qrcodes",
        `${booking._id}.png`
      );

      const qrData = `🚌 DSRTC Ticket
Booking ID: ${booking._id}
Bus: ${bus.busNumber}
Destination: ${destination}
Driver: ${bus.driverName}
Driver's Number: ${bus.driverPhone}
Passengers: ${totalPassengers}
Fare: ₹${totalBill}`;

      await QRCode.toFile(qrFilePath, qrData);

      const qrUrl = `${PUBLIC_URL.replace(/\/$/, "")}/qrcodes/${booking._id}.png`;
      console.log("✅ QR Generated:", qrUrl);

      // 💬 Send WhatsApp ticket
      await sendWhatsAppMessage(
        userSession.userNumber,
        `🎉 *Payment Successful!*\nYour DSRTC ticket is confirmed.\n\n${qrData}`,
        qrUrl
      );

      // ✅ Mark session complete
      userSession.step = "completed";
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Razorpay webhook error:", err);
    res.status(500).json({ success: false });
  }
};

module.exports.sessions = sessions;
