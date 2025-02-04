import express, { Request, Response } from "express";
import { generateItems, items } from "./controllers/items.controller.v4";
import { errorHandler } from "./middlewares/error.middleware.v1";

const app = express();
const port = 3005;

// Generate 20 items when the server starts
items.push(...generateItems(20));

// Routes
app.get("/api/v5/items", (req: Request, res: Response) => {
  res.status(200).json({ items });
});

// Use error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
