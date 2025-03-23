import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

function generateToken(user: IUser) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: 86400, // 24 hours
  });
}

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token });
    return;
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
    return;
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = generateToken(user);
    res.status(200).json({ token });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
    return;
  }
});

export default router;
