const User = require("../models/User");

exports.getSignup = (req, res) => res.render("signup");
exports.getLogin = (req, res) => res.render("login");

exports.signup = async (req, res) => {
  const { username, email, password, signupCode } = req.body;
  try {
    if (signupCode !== process.env.KSRTC_SIGNUP_CODE) {
      return res.status(403).send("❌ Unauthorized signup.");
    }
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return res.status(500).send("Error logging in after signup");
      res.redirect("/admin");
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

exports.login = (passport) => (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) return res.redirect("/login");
    req.logIn(user, (err) => (err ? next(err) : res.redirect("/admin")));
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};
