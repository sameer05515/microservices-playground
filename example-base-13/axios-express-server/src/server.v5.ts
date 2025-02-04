import express from "express";
import { generateItems, getItems, getItemsById } from "./controllers/items.controller.v4";
import { errorHandler } from "./middlewares/error.middleware.v1";

const app = express();
const port = 3005;

// Generate 20 items when the server starts
generateItems(20);

// Routes
// app.get("/api/v5/items", (req: Request, res: Response) => {
//   res.status(200).json({ items });
// });

app.get("/api/v5/items", getItems);
app.get("/api/v5/items/:id", getItemsById);

// Use error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
