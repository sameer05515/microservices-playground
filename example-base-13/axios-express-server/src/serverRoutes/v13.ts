import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { User } from "../models/user.model.v4";

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface AuthRequest extends Request {
  user?: { id: string; roles: string[] };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("Cookies:", req.cookies); // 🔍 Log received cookies
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("id roles");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = { id: user.id, roles: user.roles };
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid token" });
  }
};

// Register New User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles } = req.body;

    if (!username || !email || !password || !roles) {
      res.status(400).json({ message: "Name, Email, role & Password required" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ username, email, password: hashedPassword, roles: [roles] });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login User
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(400).json({ message: "Invalid email or password" });
//       return;
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(400).json({ message: "Invalid email or password" });
//       return;
//     }

//     // Generate JWT Token
//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({ token });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const router = express.Router();
router.use(cookieParser());
// router.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
// router.use(cors());
router.post("/auth/register", registerUser);
// router.post("/auth/login", loginUser);
// 🔥 Login Endpoint (Issues JWT)
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET!, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Login successful", user: { id: user.id, roles: user.roles } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 Fetch Authenticated User (Protected)
router.get("/auth/me", verifyToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// 🔥 Logout Endpoint (Clears Token)
router.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

export default router;
