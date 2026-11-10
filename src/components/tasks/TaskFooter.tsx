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
      <p className={styles.counter} aria-live="polite">
        <strong>{activeCount}</strong> {plural(activeCount, ["активная задача", "активные задачи", "активных задач"])}
      </p>

      <TaskFilters className={styles.filters} value={filter} onChange={onFilterChange} />

      <button type="button" className={styles.clear} onClick={clearCompleted} disabled={doneCount === 0}>
        Удалить выполненные{doneCount > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {doneCount}
          </span>
        )}
      </button>
    </div>
  );
}
