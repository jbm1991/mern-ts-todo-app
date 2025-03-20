import express from "express";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Task from "../models/Task";

const router = express.Router();
interface TaskRequestBody {
  title: string;
  completed: boolean;
}

interface TaskRequestParams {
  id: string;
}

interface TaskResponseBody {}

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
router.put(
  "/:id",
  async (
    req: Request<TaskRequestParams, {}, TaskRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { completed } = req.body;
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { completed },
        {
          new: true,
        }
      );
      if (!updatedTask)
        return res.status(404).json({ error: "Task not found" });
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }
);

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
