const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET || "dev-secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );
}

async function register(name, email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  const exists = await User.findOne({
    email: normalizedEmail
  });

  if (exists) {
    throw new Error("Email already registered");
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hash
  });

  return {
    user,
    token: createToken(user)
  };
}

async function login(email, password) {
  const user = await User.findOne({
    email: email.toLowerCase().trim()
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(
    password,
    user.password
  );

  if (!valid) {
    throw new Error("Invalid email or password");
  }

  return {
    user,
    token: createToken(user)
  };
}

module.exports = {
  register,
  login,
  createToken
};
