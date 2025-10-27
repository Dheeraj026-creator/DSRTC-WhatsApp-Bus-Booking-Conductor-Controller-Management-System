const Bus = require("../models/busschema");
const razorpay = require("../config/razorpay");
const { sendWhatsAppMessage } = require("../config/whatsapp");
const { sessions } = require("./razorpayController");

const PUBLIC_URL = process.env.PUBLIC_URL || "";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "dsrtc_verify";

/* ✅ WhatsApp Verification (GET) */
exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Meta webhook verified");
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
};

/* ✅ WhatsApp Message Receiver */
exports.receiveMessage = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (!messages || !messages.length) return res.sendStatus(200);

    const message = messages[0];
    const from = message.from;
    const text = message.text?.body?.trim().toLowerCase() || "";

    // 🧩 Reset session if user says hi/hello anytime
    if (["hi", "hello"].includes(text)) {
      delete sessions[from];
      sessions[from] = { step: "greeting", userNumber: from };

      console.log(`📩 WhatsApp msg from ${from}: "${text}" [reset → greeting]`);

      await sendWhatsAppMessage(
        from,
        `👋 *Welcome to DSRTC Smart Bus Booking!*\n\nPlease choose destination:\n1️⃣ Mysore\n2️⃣ Bangalore`
      );
      sessions[from].step = "destination";
      return res.sendStatus(200);
    }

    // 🧠 Normal flow continues
    if (!sessions[from]) sessions[from] = { step: "greeting", userNumber: from };
    const session = sessions[from];

    console.log(`📩 WhatsApp msg from ${from}: "${text}" [${session.step}]`);

    if (session.step === "greeting") {
      await sendWhatsAppMessage(from, "💡 Type *hi* to start booking.");

    } else if (session.step === "destination") {
      if (text === "1") session.destination = "Mysore";
      else if (text === "2") session.destination = "Bangalore";
      else return await sendWhatsAppMessage(from, "⚠️ Reply with *1* or *2*.");

      await sendWhatsAppMessage(from, `📍 Destination: *${session.destination}*\nEnter passenger details (e.g. 2 men, 1 woman, 1 child):`);
      session.step = "passengers";

    } else if (session.step === "passengers") {
      const numbers = text.match(/\d+/g) || [];
      session.passengers = {
        men: parseInt(numbers[0] || 0),
        women: parseInt(numbers[1] || 0),
        children: parseInt(numbers[2] || 0),
      };
      const { men, women, children } = session.passengers;
      const totalPassengers = men + women + children;
      session.totalBill = men * 210 + children * 110;

      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      const availableBuses = await Bus.find({
        totalSeats: { $gte: totalPassengers },
        departureTime: { $gte: currentTime },
      }).sort({ departureTime: 1 });

      if (!availableBuses.length) {
        await sendWhatsAppMessage(from, "😔 No buses available right now.");
        session.step = "greeting";
        return;
      }

      session.availableBuses = availableBuses;
      let msg = `🧾 *Booking Summary:*\nDestination: ${session.destination}\nPassengers: 👨 ${men} | 👩 ${women} | 👧 ${children}\n💰 Fare: ₹${session.totalBill}\n\n🚌 *Available Buses:*\n`;
      availableBuses.forEach((bus, i) => (msg += `${i + 1}. ${bus.busNumber} — ${bus.departureTime}\n`));
      msg += `\n👉 Reply with *bus number (e.g. 1)* to confirm.`;
      await sendWhatsAppMessage(from, msg);
      session.step = "selectBus";

    } else if (session.step === "selectBus") {
      const index = parseInt(text) - 1;
      const bus = session.availableBuses[index]
        ? await Bus.findById(session.availableBuses[index]._id)
        : null;

      if (!bus) return await sendWhatsAppMessage(from, "⚠️ Invalid bus number.");

      session.selectedBus = bus;
      const amountInPaise = session.totalBill * 100;
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      session.paymentOrderId = order.id;
      session.step = "waitingPayment";

      await sendWhatsAppMessage(
        from,
        `💳 *Payment Required*\n\n🚌 Bus No: ${bus.busNumber}\n📍 ${session.destination}\n💰 Total: ₹${session.totalBill}\n\nPay here:\n${PUBLIC_URL}/pay/${order.id}`
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ WhatsApp handler error:", err);
    res.sendStatus(500);
  }
};
