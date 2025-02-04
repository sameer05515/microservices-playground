import express, { Request, Response, NextFunction } from "express";
import { Item } from "./models/item.model.v4"; // Assuming we are creating this interface in a file models/Item.ts

const app = express();
const port = 3005;

// In-memory database for simplicity
let items: Item[] = [];

// Sample Error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR]: ${err.message}`);
  res.status(500).json({
    message: err.message || "Something went wrong!",
    stack: err.stack,
  });
};

// Sample route to fetch items
app.get("/api/v4/items", (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!items.length) {
      throw new Error("No items found!");
    }
    res.status(200).json({ items });
  } catch (error) {
    next(error); // Pass errors to the centralized error handler
  }
});

// Sample route to generate 20 items
app.get("/api/v4/generate-items", (req: Request, res: Response, next: NextFunction) => {
  try {
    if (items.length > 0) {
      res.status(200).json({ message: "Items already generated" });
      return;
    }

    // Generate 20 items
    items = generateItems(20);
    res.status(201).json({ message: "Items generated successfully", items });
  } catch (error) {
    next(error); // Pass errors to the centralized error handler
  }
});

// Function to generate 20 items
function generateItems(count: number): Item[] {
  const generatedItems: Item[] = [];
  for (let i = 1; i <= count; i++) {
    generatedItems.push({
      id: i,
      name: `Item ${i}`,
      category: `Category ${Math.floor(Math.random() * 3) + 1}`,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      availableInStock: Math.random() > 0.5,
      currentPcsInStock: Math.floor(Math.random() * 50),
    });
  }
  return generatedItems;
}

// Use error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
