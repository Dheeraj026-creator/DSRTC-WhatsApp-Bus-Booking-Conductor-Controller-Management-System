// models/User.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "controller" } // you can add roles later
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
