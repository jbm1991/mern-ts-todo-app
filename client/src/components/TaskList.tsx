import { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  handleDeleteTask: (id: string) => void;
  handleToggleTask: (id: string, completed: boolean) => void;
}

const TaskList = ({
  tasks,
  handleDeleteTask,
  handleToggleTask,
}: TaskListProps) => {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className={task.completed ? "completed" : ""}>
          <span onClick={() => handleToggleTask(task._id, task.completed)}>
            {task.completed ? "✅" : "⭕️"} {task.title}
          </span>
          <button
            className="delete-btn"
            onClick={() => handleDeleteTask(task._id)}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
