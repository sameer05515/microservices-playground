import express, { Request, Response, NextFunction } from "express";
import customErrorTestingRoutes from "../routes/custom-errors-testing.routes";
import { errorHandler } from "../middlewares/errorHandler.middleware.v2";
import { notFoundHandler } from "../middlewares/notFound.middleware.v1";

const router = express.Router();

// Register Routes
router.use("/", customErrorTestingRoutes);

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
router.use(notFoundHandler);

// Centralized Error Handling
router.use(errorHandler);


export default router;