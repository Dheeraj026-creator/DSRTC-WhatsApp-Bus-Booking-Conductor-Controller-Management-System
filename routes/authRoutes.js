const express = require("express");
const passport = require("passport");
const { getSignup, getLogin, signup, login, logout } = require("../controllers/authController");

const router = express.Router();

router.get("/signup", getSignup);
router.post("/signup", signup);
router.get("/login", getLogin);
router.post("/login", login(passport));
router.get("/logout", logout);

module.exports = router;
