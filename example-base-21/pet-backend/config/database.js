const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('❌ MongoDB connection error: MONGODB_URI is not defined in environment variables');
      console.error('💡 Please create a .env file with MONGODB_URI=mongodb://localhost:27017/personal-expense-tracker');
      console.error('💡 Or set the MONGODB_URI environment variable');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options for newer Mongoose versions
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('💡 Make sure MongoDB is running and the connection string is correct');
    process.exit(1);
  }
};

module.exports = connectDB;

