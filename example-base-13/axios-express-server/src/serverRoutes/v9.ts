import express, { Request, Response, NextFunction } from "express";
import authRoutes from "../routes/auth.routes.v3";
// import { notFoundHandler } from "../middlewares/notFound.middleware.v1";
// import { authenticateToken } from "./middlewares/authHandler.middleware.v1";
import { authHandler, authorizeRoles, AuthRequest } from "../middlewares/authHandler.middleware.v2";

const router = express.Router();

// Routes
router.use("/auth", authRoutes);

router.get("/protected/hello", authHandler, (req, res) => {
  res.json({ message: "Hello, World! ✅" });
});

router.get("/protected/hello2", authHandler, (req, res) => {
  res.json({ message: "I am also protected! ✅" });
});

// Public route (no authentication needed)
router.get("/public", (req, res) => {
  res.json({ message: "Public content" });
});

// Protected route (only authenticated users can access)
router.get("/user-dashboard", authHandler, (req: AuthRequest, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

// Admin-only route
router.get("/admin-dashboard", authHandler, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

export default router;
