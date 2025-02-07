import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
import serverRoutes from "./serverRoutes";

dotenv.config();

const app = express();
const port = 3005;

// app.use(cors());
// ✅ Configure CORS properly
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 Frontend origin
    credentials: true, // 👈 Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ["Content-Type", "Authorization"], // 👈 Explicitly allow necessary headers
  })
);
app.use(express.json());

app.use(serverRoutes);

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
app.use(notFoundHandler);

// 5️⃣ Global error handler (handles all other errors)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[ERROR]: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    statusCode: err.status || 500,
  });
});

// Connect to MongoDB and Start Server
mongoose
  .connect((process.env.MONGODB_URI as string) || "mongodb://127.0.0.1:27017/itemsdb")
  .then(() => {
    console.log("Connected to MongoDB");
    // app.listen(port, () => console.log(`Server running on port ${port}`));
    app.listen(port, () => console.log(`🚀 Server is running on http://localhost:${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
