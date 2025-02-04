import { Request, Response } from "express";
import { items } from "../utils/data";

export const getItems = (req: Request, res: Response) => {
  let { category, sortBy } = req.query;
  let filteredItems = [...items];

  if (category) {
    filteredItems = filteredItems.filter((item) => item.category === category);
  }

  if (sortBy === "price") {
    filteredItems.sort((a, b) => a.price - b.price);
  }

  res.json(filteredItems);
};
