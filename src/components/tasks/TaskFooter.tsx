import { plural } from "@/lib/plural";
import { clearCompleted } from "@/lib/tasks-store";
import type { TaskFilter } from "@/types/task";
import { TaskFilters } from "./TaskFilters";
import styles from "./TaskFooter.module.css";

interface TaskFooterProps {
  activeCount: number;
  doneCount: number;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function TaskFooter({ activeCount, doneCount, filter, onFilterChange }: TaskFooterProps) {
  return (
    <div className={styles.footer}>
      <span className={styles.counter}>
        {activeCount} {plural(activeCount, ["активная задача", "активные задачи", "активных задач"])}
      </span>

      <TaskFilters value={filter} onChange={onFilterChange} />

      <button type="button" onClick={clearCompleted} disabled={doneCount === 0}>
        Удалить выполненные
      </button>
    </div>
  );
}
