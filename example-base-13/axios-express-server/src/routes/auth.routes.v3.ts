import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel as User } from "../models/user.model.v2";

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

const signUp = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, Email & Password required" });
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword, role });

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // 👈 Include role in token
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token: accessToken });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

//========== router code ==================

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

export default router;
