const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function loadUser(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return next();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");
    if (user) {
      req.user = user;
      res.locals.user = user;
    }
    next();
  } catch (err) {
    res.clearCookie("token");
    next();
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return res.redirect("/auth/login");
  next();
}

module.exports = { loadUser, requireAuth };
