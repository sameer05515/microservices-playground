import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// import { notFoundHandler } from "./middlewares/notFound.middleware.v1";
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

const router = express.Router();

// Routes
router.use("/auth", authRouter);

export default router;
