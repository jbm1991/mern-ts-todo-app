import { useEffect, useState, useCallback } from "react";
import { addTask, fetchTasks, deleteTask, updateTask } from "../api/tasks";
import TaskList from "../components/TaskList";
import { Task } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    () => {
      const stored = localStorage.getItem("taskFilter");
      if (stored === "completed" || stored === "incomplete") return stored;
      return "all";
    }
  );

  const { token } = useAuth();

  useEffect(() => {
    localStorage.setItem("taskFilter", filter);
  }, [filter]);

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

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <ThemeToggle />
      <button onClick={handleLogout}>Logout</button>
      <h1>Task List</h1>

      <p>
        ✅ Completed: {completedCount} ⭕ Incomplete: {incompleteCount}
      </p>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task title..."
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="filters">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={filter === "incomplete" ? "active" : ""}
        >
          Incomplete
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          handleDeleteTask={handleDeleteTask}
          handleToggleTask={handleToggleTask}
        />
      )}
    </div>
  );
};

export default Home;
