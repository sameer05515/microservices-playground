import { Request, Response } from "express";
import { ItemModel } from "../models/item.model.v3";

// 🟢 Fetch Items from MongoDB
export const getItemsFromDB = async (req: Request, res: Response) => {
  try {
    const { category, sortBy } = req.query;
    let query: any = {};

    if (category) {
      query.category = category;
    }

    let items = await ItemModel.find(query);

    if (sortBy === "price") {
      items = items.sort((a, b) => a.price - b.price);
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// 🔴 Save New Item to MongoDB
export const addItemToDB = async (req: Request, res: Response) => {
  try {
    
    const { name, category, price } = req.body;

    if (!name || !category || typeof price !== "number") {
      res.status(400).json({ message: "Invalid input data" });
      return;
      //   throw new Error("Invalid input data");
    }

    const newItem = new ItemModel({ name, category, price });
    await newItem.save();

    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error saving item", error });
  }
};
