import express from "express";
import { generateItems, getItems, getItemsById } from "./controllers/items.controller.v5";
import { errorHandler } from "./middlewares/errorHandler.middleware.v1";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";

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

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
app.use(notFoundHandler);

// Use error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
