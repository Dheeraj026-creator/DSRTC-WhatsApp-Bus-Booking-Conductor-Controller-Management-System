const express = require("express");
const router = express.Router();
const razorpayController = require("../controllers/razorpayController");

router.post("/razorpay/webhook", express.raw({ type: "application/json" }), razorpayController.webhook);
router.get("/pay/:orderId", razorpayController.getPaymentPage);

module.exports = router;
