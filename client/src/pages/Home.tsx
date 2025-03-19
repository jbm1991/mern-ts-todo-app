import { useEffect, useState } from "react";
import { addTask, fetchTasks } from "../api/tasks";

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
