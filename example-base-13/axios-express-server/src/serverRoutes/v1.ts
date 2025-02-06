import express, { Request, Response } from "express";

const router = express.Router();

// Sample hardcoded data
const items = [
  { id: 1, name: "Item A", category: "Tech", price: 100 },
  { id: 2, name: "Item B", category: "Home", price: 50 },
  { id: 3, name: "Item C", category: "Tech", price: 150 },
];

const getItems = (req: Request, res: Response) => {
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

router.get("/items", getItems);

export default router;
