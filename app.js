if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    console.log("🧩 Loaded .env for local environment");
  }
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const Bus = require("./models/busschema");

const { connectDB } = require("./config/db");
require("./config/passport")(passport);

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Database ---------- */
connectDB();

/* ---------- Razorpay & WhatsApp Config ---------- */
require("./config/razorpay");
require("./config/whatsapp");

/* ---------- EJS Setup ---------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/qrcodes", express.static(path.join(__dirname, "public/qrcodes")));

/* ---------- Razorpay Webhook (RAW BODY REQUIRED) ---------- */
// ⚠️ Must come BEFORE express.json()
app.use("/razorpay/webhook", express.raw({ type: "application/json" }));

/* ---------- Normal Middleware ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* ---------- Routes ---------- */
app.get("/", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.render("home", { buses, user: req.user || null });
  } catch (err) {
    console.error("Error loading home:", err);
    res.render("home", { buses: [], user: req.user || null });
  }
});

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/adminRoutes"));
app.use("/", require("./routes/conductorRoutes"));
app.use("/", require("./routes/razorpayRoutes"));
app.use("/", require("./routes/whatsappRoutes"));

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`🚍 DSRTC Server running on http://localhost:${PORT}`);
});
