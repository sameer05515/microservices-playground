import express from "express";
import dotenv from "dotenv";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
import cors from "cors";
import serverRoutesV1 from './serverRoutes/v1'

dotenv.config();

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/v1", serverRoutesV1);

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
