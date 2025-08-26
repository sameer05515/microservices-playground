import express, { Request, Response, NextFunction } from "express";
import { jsonErrorHandler } from "../middlewares/jsonErrorHandler.middleware";
import { notFoundHandler } from "../middlewares/notFound.middleware.v1";

const router = express.Router();

// 2️⃣ JSON parsing error handler (catches syntax errors in JSON)
router.use(jsonErrorHandler);

// 3️⃣ Define all routes
router.get("/hello", (req, res) => {
  res.json({ message: "Hello, World! ✅" });
});

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
router.use(notFoundHandler);

// 5️⃣ Global error handler (handles all other errors)
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[ERROR]: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    statusCode: err.status || 500,
  });
});

export default router;
