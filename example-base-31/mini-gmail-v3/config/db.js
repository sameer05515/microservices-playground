const mongoose = require("mongoose");

async function connectDB() {
  const uri =
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/mini_gmail";

  await mongoose.connect(uri);

  console.log("MongoDB connected");
}

module.exports = connectDB;
