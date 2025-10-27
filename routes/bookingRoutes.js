const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/bookings", bookingController.createBooking);
router.get("/bookings", bookingController.getAllBookings);
router.get("/bookings/:busNumber", bookingController.getBusBookings);

module.exports = router;
