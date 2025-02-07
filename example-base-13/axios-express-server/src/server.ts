import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
import itemsRoutesV3 from "./routes/items.routes.v3";
import taskRoutesV3 from "./routes/task.routes.v3";
import serverRoutesV1 from "./serverRoutes/v1";
import serverRoutesV10 from "./serverRoutes/v10";
import serverRoutesV11 from "./serverRoutes/v11";
import serverRoutesV12 from "./serverRoutes/v12";
import serverRoutesV13 from "./serverRoutes/v13";
import serverRoutesV4 from "./serverRoutes/v4";
import serverRoutesV5 from "./serverRoutes/v5";
import serverRoutesV6 from "./serverRoutes/v6";
import serverRoutesV7 from "./serverRoutes/v7";
import serverRoutesV8 from "./serverRoutes/v8";
import serverRoutesV9 from "./serverRoutes/v9";

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

app.use("/api/v7", serverRoutesV7);

app.use("/api/v8", serverRoutesV8);

app.use("/api/v9", serverRoutesV9);

app.use("/api/v10", serverRoutesV10);

app.use("/api/v11", serverRoutesV11);

// Add this line before `app.use(notFoundHandler)`
app.use("/api/v12", serverRoutesV12);

app.use("/api/v13", serverRoutesV13);

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
