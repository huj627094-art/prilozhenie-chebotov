import { isRunning } from "@/lib/time";
import type { Task, TaskFilter } from "@/types/task";
import { TaskItem } from "./TaskItem";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: Task[];
  now: number;
  filter: TaskFilter;
  hasTasks: boolean;
}

const emptyText: Record<TaskFilter, string> = {
  all: "Задач пока нет. Добавьте первую!",
  active: "Нет активных задач",
  done: "Нет выполненных задач",
};

export function TaskList({ tasks, now, filter, hasTasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className={styles.empty}>{emptyText[hasTasks ? filter : "all"]}</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} now={isRunning(task) ? now : 0} />
      ))}
    </ul>
  );
}
