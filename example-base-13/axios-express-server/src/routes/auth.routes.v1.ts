import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.v1";

const router = express.Router();

// Register User
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: "User already exists!" });
       return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

export default router;
