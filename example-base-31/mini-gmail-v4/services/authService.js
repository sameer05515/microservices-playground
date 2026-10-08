const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function register(name, email, password) {
  email = email.trim().toLowerCase();
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already registered");

  const hash = await bcrypt.hash(password, 10);
  return User.create({ name, email, password: hash });
}

async function login(email, password) {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error("Invalid email or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
  return { user, token };
}

module.exports = { register, login };
