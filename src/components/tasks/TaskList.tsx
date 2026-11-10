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

const emptyMessages: Record<TaskFilter, { title: string; text: string }> = {
  all: {
    title: "Список пуст",
    text: "Добавьте первую задачу и задайте ей время — например, «Разобрать почту» на 15 минут.",
  },
  active: {
    title: "Активных задач нет",
    text: "Всё сделано. Можно добавить новую задачу или отдохнуть.",
  },
  done: {
    title: "Пока ничего не выполнено",
    text: "Отметьте задачу кружком слева, и она появится здесь.",
  },
};

export function TaskList({ tasks, now, filter, hasTasks }: TaskListProps) {
  if (tasks.length === 0) {
    const message = emptyMessages[hasTasks ? filter : "all"];
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>{message.title}</p>
        <p className={styles.emptyText}>{message.text}</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        // Время нужно только запущенным задачам — остальные не перерисовываются на каждом тике.
        <TaskItem key={task.id} task={task} now={isRunning(task) ? now : 0} />
      ))}
    </ul>
  );
}

export function TaskListSkeleton() {
  return (
    <ul className={styles.list} aria-busy="true" aria-label="Загрузка задач">
      {[0, 1, 2].map((index) => (
        <li key={index} className={styles.skeleton}>
          <span className={styles.skeletonDot} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonTime} />
        </li>
      ))}
    </ul>
  );
}
