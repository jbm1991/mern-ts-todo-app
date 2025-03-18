import { useEffect, useState } from "react";
import { fetchTasks } from "../api/tasks";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks().then((tasks) => {
      setTasks(tasks);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Task List</h1>
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
