import express from "express";
import customErrorTestingRoutes from "./routes/custom-errors-testing.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware.v2";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";

const app = express();
const port = 3005;

app.use(express.json());

// Register Routes
app.use("/api/v7", customErrorTestingRoutes);

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
app.use(notFoundHandler);

// Centralized Error Handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
