require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/User");
const Email = require("./models/Email");

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Email.deleteMany({});

  const password = await bcrypt.hash("123456", 12);

  const users = await User.insertMany([
    {
      name: "Prem Kumar",
      email: "prem@gmail.com",
      password
    },
    {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      password
    },
    {
      name: "Amit Kumar",
      email: "amit@gmail.com",
      password
    }
  ]);

  const prem = users[0];
  const rahul = users[1];
  const amit = users[2];

  await Email.create([
    {
      from: rahul._id,
      to: prem._id,
      toEmail: prem.email,
      subject: "Welcome to Mini Gmail v3",
      body: "Hi Prem,\n\nThis version uses MongoDB and JWT authentication.\n\nRegards,\nRahul",
      read: false,
      starred: true
    },
    {
      from: prem._id,
      to: rahul._id,
      toEmail: rahul.email,
      subject: "Project discussion",
      body: "Hi Rahul,\n\nLet's discuss the project tomorrow.\n\nRegards,\nPrem",
      read: true
    },
    {
      from: amit._id,
      to: prem._id,
      toEmail: prem.email,
      subject: "Interview preparation",
      body: "Hi Prem,\n\nLet's discuss Java and Spring Boot interview preparation.",
      read: false
    },
    {
      from: prem._id,
      toEmail: "",
      subject: "My first MongoDB draft",
      body: "This is a draft message.",
      draft: true
    }
  ]);

  console.log("Seed completed.");
  console.log("Demo: prem@gmail.com / 123456");

  await mongoose.disconnect();
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
