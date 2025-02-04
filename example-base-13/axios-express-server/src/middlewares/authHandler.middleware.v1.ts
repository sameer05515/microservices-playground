import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any; // To store user data from JWT
}

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";
// const JWT_EXPIRY: string = process.env.JWT_EXPIRY || "1h";

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
     res.status(401).json({ message: "Access denied. No token provided." });
     return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
