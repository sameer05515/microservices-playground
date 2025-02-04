// controllers/item.controller.ts

import { NextFunction, Request, Response } from "express";
import { Item } from "../models/item.model.v4";

// In-memory database for simplicity
let items: Item[] = [];

// Function to generate random items
export function generateItems(count: number) {
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
  //   return generatedItems;
  items.push(...generatedItems);
}

// Route handler to fetch items
export const getItems = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!items.length) {
      throw new Error("No items found!");
    }
    res.status(200).json({ items });
  } catch (error) {
    // res.status(500).json({ message: error instanceof Error ? error.message : "Some Unexpected Error occurred" });
    next(error); // Pass errors to the centralized error handler
  }
};

// Route handler to fetch items
export const getItemsById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const item = items.find((item) => +id === item.id);
    if (!item) {
      throw new Error("item not found for id: " + id);
    }
    res.status(200).json({ item });
  } catch (error) {
    // res.status(500).json({ message: error instanceof Error ? error.message : "Some Unexpected Error occurred" });
    next(error); // Pass errors to the centralized error handler
  }
};
