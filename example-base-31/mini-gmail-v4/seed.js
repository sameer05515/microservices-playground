require("dotenv").config();
const connectDB = require("./config/db");
const { register } = require("./services/authService");
const User = require("./models/User");

(async () => {
  await connectDB();

  const users = [
    ["Prem Kumar", "prem@gmail.com"],
    ["Demo User", "demo@gmail.com"],
    ["Admin User", "admin@gmail.com"]
  ];

  for (const [name, email] of users) {
    if (!(await User.findOne({ email }))) {
      await register(name, email, "123456");
      console.log(`Created ${email}`);
    }
  }

  console.log("Seed complete. Password for all demo users: 123456");
  process.exit(0);
})();
