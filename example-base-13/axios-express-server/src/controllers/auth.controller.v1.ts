import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.v1";

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || "1h";

// ✅ User Signup
export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// ✅ User Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // Generate JWT Token
    // const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    //   expiresIn: 1,
    // });
    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    } as jwt.SignOptions);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
