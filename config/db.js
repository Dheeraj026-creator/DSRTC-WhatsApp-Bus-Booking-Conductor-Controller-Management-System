const mongoose = require("mongoose");
const Bus = require("../models/busschema");
const data = require("../init"); // your seed data file

// 🕒 Convert AM/PM → 24-hour format
function to24Hour(time12h) {
  if (!time12h) return time12h;
  const time = time12h.trim();

  // already 24-hour format? return as is
  if (/^\d{2}:\d{2}$/.test(time)) return time;

  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");

  if (hours === "12") hours = "00";
  if (modifier && modifier.toUpperCase() === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes}`;
}

// 🚀 Connect + seed buses if needed
exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI
    );
    console.log("✅ MongoDB connected successfully");

    // Convert and seed data
    const convertedData = data.map((bus) => ({
      ...bus,
      departureTime: to24Hour(bus.departureTime),
      arrivalTime: to24Hour(bus.arrivalTime),
    }));

    await Bus.deleteMany({});
    await Bus.insertMany(convertedData);
    console.log("✅ Data converted & inserted successfully!");

    const sample = await Bus.findOne();
    console.log("🕒 Sample bus:", sample?.departureTime, "→", sample?.arrivalTime);
  } catch (err) {
    console.error("❌ MongoDB connection or seeding failed:", err);
    process.exit(1);
  }
};
