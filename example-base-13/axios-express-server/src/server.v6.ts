import express from "express";
import { jsonErrorHandler } from "./middlewares/jsonErrorHandler.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";

const app = express();
const port = 3005;

// 1️⃣ JSON parsing middleware (must be before routes)
app.use(express.json());

// 2️⃣ JSON parsing error handler (catches syntax errors in JSON)
app.use(jsonErrorHandler);

// 3️⃣ Define all routes
app.get("/api/v6/hello", (req, res) => {
  res.json({ message: "Hello, World! ✅" });
});

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

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
