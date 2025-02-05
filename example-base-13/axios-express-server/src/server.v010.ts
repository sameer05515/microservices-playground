import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
//================= roles.ts - start =================================
// import { roles } from "../roles";

export const roles: Record<string, string[]> = {
  USER: ["read_profile"],
  MODERATOR: ["read_profile", "approve_posts"],
  ADMIN: ["read_profile", "approve_posts", "manage_users"],
};

//================= roles.ts - end =================================

//--------------------------------------------------------------------------------------------------------

//================= authMiddleware.ts - start =================================
export interface AuthRequest extends Request {
  user?: any; // To store user data from JWT
}
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = (requiredPermissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

      if (!decoded.role || !roles[decoded.role]) {
        res.status(403).json({ message: "Role not assigned or invalid" });
        return;
      }

      const userPermissions = roles[decoded.role];

      const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

      if (!hasPermission) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      req.user = decoded; // Store user info in request object
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

//================= authMiddleware.ts - end =================================

//--------------------------------------------------------------------------------------------------------

//================= routes.ts - start =================================

// import { authorize } from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.get("/profile", authMiddleware(["read_profile"]), (req, res) => {
  res.json({ message: "Profile data" });
});

authRouter.post("/approve-post", authMiddleware(["approve_posts"]), (req, res) => {
  res.json({ message: "Post approved" });
});

authRouter.delete("/user/:id", authMiddleware(["manage_users"]), (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
});

// export default router;

//================= routes.ts - end =================================

//--------------------------------------------------------------------------------------------------------

//================= actual server code - start =================================


/**
 * This version of routes seems incomplete. Will work on it later.
 * 
*/

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v10/auth", authRouter);

// app.get("/api/v9/protected/hello", authHandler, (req, res) => {
//   res.json({ message: "Hello, World! ✅" });
// });

// app.get("/api/v9/protected/hello2", authHandler, (req, res) => {
//   res.json({ message: "I am also protected! ✅" });
// });

// // Public route (no authentication needed)
// app.get("/api/v9/public", (req, res) => {
//   res.json({ message: "Public content" });
// });

// // Protected route (only authenticated users can access)
// app.get("/api/v9/user-dashboard", authHandler, (req: AuthRequest, res) => {
//   res.json({ message: `Welcome, ${req.user.email}!` });
// });

// // Admin-only route
// app.get("/api/v9/admin-dashboard", authHandler, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome, Admin!" });
// });

// 4️⃣ Route Not Found Middleware (must be after all valid routes)
app.use(notFoundHandler);

// Connect to MongoDB and Start Server
mongoose
  .connect((process.env.MONGODB_URI as string) || "mongodb://127.0.0.1:27017/itemsdb")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
