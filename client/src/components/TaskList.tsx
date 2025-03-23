import { Task } from "../types";
import { motion, AnimatePresence } from "framer-motion";

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
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.li
            key={task._id}
            className={task.completed ? "completed" : ""}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.2 }}
          >
            <span onClick={() => handleToggleTask(task._id, task.completed)}>
              {task.completed ? "✅" : "⭕️"} {task.title}
            </span>
            <button
              className="delete-btn"
              onClick={() => handleDeleteTask(task._id)}
            >
              ❌
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default TaskList;
