// RBAC

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.v3";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
// import { authenticateToken } from "./middlewares/authHandler.middleware.v1";
import { authHandler, authorizeRoles, AuthRequest } from "./middlewares/authHandler.middleware.v2";

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v9/auth", authRoutes);

app.get("/api/v9/protected/hello", authHandler, (req, res) => {
  res.json({ message: "Hello, World! ✅" });
});

app.get("/api/v9/protected/hello2", authHandler, (req, res) => {
  res.json({ message: "I am also protected! ✅" });
});

// Public route (no authentication needed)
app.get("/api/v9/public", (req, res) => {
  res.json({ message: "Public content" });
});

// Protected route (only authenticated users can access)
app.get("/api/v9/user-dashboard", authHandler, (req: AuthRequest, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

// Admin-only route
app.get("/api/v9/admin-dashboard", authHandler, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
app.use(notFoundHandler);

// Connect to MongoDB and Start Server
mongoose
  .connect((process.env.MONGODB_URI as string) || "mongodb://127.0.0.1:27017/itemsdb")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
