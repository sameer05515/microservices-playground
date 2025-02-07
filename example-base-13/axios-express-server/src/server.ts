import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
import cors from "cors";
import serverRoutesV1 from "./serverRoutes/v1";
import itemsRoutesV3 from "./routes/items.routes.v3";
import taskRoutesV3 from "./routes/task.routes.v3";
import serverRoutesV4 from "./serverRoutes/v4";
import serverRoutesV5 from "./serverRoutes/v5";
import serverRoutesV6 from "./serverRoutes/v6";

dotenv.config();

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", serverRoutesV1);
/** v2 version was only rewrite of v1 by seggregating code into multple files, hence separate route not needed*/
app.use("/api/v2", serverRoutesV1);

app.use("/api/v3", itemsRoutesV3);
app.use("/api/v3", taskRoutesV3); // All task-related routes will be prefixed with /api/v3

app.use("/api/v4", serverRoutesV4);

app.use("/api/v5", serverRoutesV5);

app.use("/api/v6", serverRoutesV6);

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

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// Connect to MongoDB and Start Server
mongoose
  .connect((process.env.MONGODB_URI as string) || "mongodb://127.0.0.1:27017/itemsdb")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
