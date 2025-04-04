import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Task from "../models/Task";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();
interface TaskRequestBody {
  title: string;
  completed: boolean;
}

interface TaskUpdateBody {
  completed: boolean;
}

// Middleware for validation errors
const validateTask = [
  body("title").notEmpty().withMessage("Title is required"),
];

// Authenticate all routes
router.use(authenticate);

// Get all tasks
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user!.id });
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
    req: AuthRequest,
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
      const newTask = await Task.create({ title, userId: req.user!.id });
      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }
);

// Update a task (toggle completion)
router.put(
  "/:id",
  async (req: Request<{ id: string }, {}, TaskUpdateBody>, res: Response) => {
    try {
      const { completed } = req.body;

      if (typeof completed !== "boolean") {
        res.status(400).json({ error: "Completed must be a boolean" });
        return;
      }

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { completed },
        { new: true } // Returns the updated task
      );

      if (!updatedTask) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.json(updatedTask);
      return;
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
      return;
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
