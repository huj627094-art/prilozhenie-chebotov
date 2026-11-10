import { cx } from "@/lib/cx";
import type { TaskFilter } from "@/types/task";
import styles from "./TaskFilters.module.css";

const options: Array<{ value: TaskFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "done", label: "Выполненные" },
];

interface TaskFiltersProps {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  className?: string;
}

export function TaskFilters({ value, onChange, className }: TaskFiltersProps) {
  return (
    <div className={cx(styles.filters, className)} role="group" aria-label="Фильтр задач">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
