import express from "express";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Task from "../models/Task";

const router = express.Router();
interface TaskRequestBody {
  title: string;
}

// Middleware for validation errors
const validateTask = [
  body("title").notEmpty().withMessage("Title is required"),
];

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create a task
router.post(
  "/",
  validateTask,
  async (
    req: Request<{}, {}, TaskRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }

    try {
      const { title } = req.body;
      const newTask = await Task.create({ title });
      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }
);

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete task" });
  }
});

export default router;
