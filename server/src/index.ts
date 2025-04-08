import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoutes";
import helmet from "helmet";
import compression from "compression";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 4444;
const MONGO_URI = process.env.MONGO_URI as string;

// Middleware
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json());

// error handler middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    console.error("Error: ", error.message);
  } else {
    console.error("Error: ", error);
  }
  res.status(500).json({ error: "Something went wrong" });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message);
  });

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Task routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
