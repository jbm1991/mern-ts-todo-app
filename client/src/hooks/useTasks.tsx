import { useState, useEffect, useCallback } from "react";
import { Task } from "../types";
import { addTask, fetchTasks, deleteTask, updateTask } from "../api/tasks";

export const useTasks = (token: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    () => {
      const stored = localStorage.getItem("taskFilter");
      if (stored === "completed" || stored === "incomplete") return stored;
      return "all";
    }
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchTasks(token).then((tasks) => {
      setTasks(tasks);
      setLoading(false);
    });
  }, [token]);

  const handleAddTask = useCallback(async () => {
    if (!newTask.trim()) return;
    if (!token) return;

    const createdTask = await addTask(newTask, token);
    if (createdTask) {
      setTasks((prev) => [...prev, createdTask]);
      setNewTask("");
    } else {
      setError("Failed to add task. Try again.");
    }
  }, [newTask, token]);

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      if (!token) return;
      const isDeleted = await deleteTask(taskId, token);
      if (isDeleted) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
      } else {
        setError("Failed to delete task. Try again.");
      }
    },
    [token]
  );

  const handleToggleTask = useCallback(
    async (taskId: string, completed: boolean) => {
      if (!token) return;
      const updatedTask = await updateTask(taskId, !completed, token);
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) => (task._id === taskId ? updatedTask : task))
        );
      } else {
        setError("Failed to update task. Try again.");
      }
    },
    [token]
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const incompleteCount = tasks.length - completedCount;

  return {
    tasks: filteredTasks,
    error,
    loading,
    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
    newTask,
    setNewTask,
    filter,
    setFilter,
    completedCount,
    incompleteCount,
  };
};
