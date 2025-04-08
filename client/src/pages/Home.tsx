import { useEffect } from "react";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTasks } from "../hooks/useTasks";

const Home = () => {
  const { token } = useAuth();
  const {
    tasks,
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
  } = useTasks(token);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    localStorage.setItem("taskFilter", filter);
  }, [filter]);

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
          tasks={tasks}
          handleDeleteTask={handleDeleteTask}
          handleToggleTask={handleToggleTask}
        />
      )}
    </div>
  );
};

export default Home;
