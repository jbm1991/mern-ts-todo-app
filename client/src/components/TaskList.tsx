import { Task } from "../types";
import { AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";

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
          <TaskItem
            task={task}
            key={task._id}
            handleDeleteTask={handleDeleteTask}
            handleToggleTask={handleToggleTask}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default TaskList;
