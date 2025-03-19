import { useEffect, useState } from "react";
import { addTask, fetchTasks, deleteTask } from "../api/tasks";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks().then((tasks) => {
      setTasks(tasks);
      setLoading(false);
    });
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const createdTask = await addTask(newTask);
    if (createdTask) {
      setTasks([...tasks, createdTask]);
      setNewTask("");
    } else {
      setError("Failed to add task. Try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const isDeleted = await deleteTask(taskId);
    if (isDeleted) {
      setTasks(tasks.filter((task) => task._id !== taskId));
    } else {
      setError("Failed to delete task. Try again.");
    }
  };

  return (
    <div>
      <h1>Task List</h1>

      {/** Add Task Form */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task title..."
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              {task.title} {task.completed ? "✅" : "❌"}
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(task._id)}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
