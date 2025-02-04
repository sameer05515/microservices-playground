import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.v2";

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v8/auth", authRoutes);

// Connect to MongoDB and Start Server
mongoose
  .connect((process.env.MONGODB_URI as string) || "mongodb://127.0.0.1:27017/itemsdb")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
