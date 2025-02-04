import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemsRoutes from "./routes/items.routes.v3";
import taskRoutes from "./routes/task.routes.v3";
import { connectDB } from "./config/db.config";
import { PORT } from "./config/server.config";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v3", itemsRoutes);
app.use("/api/v3", taskRoutes); // All task-related routes will be prefixed with /api/v3

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
