import express from "express";
import cors from "cors";
import itemsRoutes from "./routes/items.routes";
import { PORT } from "./config/server.config";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v2", itemsRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
