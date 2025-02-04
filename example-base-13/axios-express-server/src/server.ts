import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// Sample hardcoded data
const items = [
  { id: 1, name: "Item A", category: "Tech", price: 100 },
  { id: 2, name: "Item B", category: "Home", price: 50 },
  { id: 3, name: "Item C", category: "Tech", price: 150 },
];

// Fetch items with optional filtering and sorting
app.get("/items", (req, res) => {
  let { category, sortBy } = req.query;
  let filteredItems = [...items];

  if (category) {
    filteredItems = filteredItems.filter((item) => item.category === category);
  }

  if (sortBy === "price") {
    filteredItems.sort((a, b) => a.price - b.price);
  }

  res.json(filteredItems);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
