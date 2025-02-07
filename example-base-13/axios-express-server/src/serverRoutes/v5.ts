import express, { Request, Response, NextFunction } from "express";
import { generateItems, getItems, getItemsById } from "../controllers/items.controller.v5";
import { errorHandler } from "../middlewares/errorHandler.middleware.v1";
import { notFoundHandler } from "../middlewares/notFound.middleware.v1";

const router = express.Router();

// Generate 20 items when the server starts
generateItems(20);

// Routes
// app.get("/api/v5/items", (req: Request, res: Response) => {
//   res.status(200).json({ items });
// });

router.get("/items", getItems);
router.get("/items/:id", getItemsById);

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
router.use(notFoundHandler);

// Use error handler middleware
router.use(errorHandler);


export default router;