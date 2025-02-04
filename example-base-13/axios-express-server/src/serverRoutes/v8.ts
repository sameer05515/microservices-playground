import express, { Request, Response, NextFunction } from "express";
import authRoutes from "../routes/auth.routes.v2";
import { notFoundHandler } from "../middlewares/notFound.middleware.v1";
import { authenticateToken } from "../middlewares/authHandler.middleware.v1";

const router = express.Router();

// Routes
router.use("/auth", authRoutes);

router.get("/protected/hello", authenticateToken, (req, res) => {
  res.json({ message: "Hello, World! ✅" });
});

router.get("/protected/hello2", authenticateToken, (req, res) => {
  res.json({ message: "I am also protected! ✅" });
});

export default router;