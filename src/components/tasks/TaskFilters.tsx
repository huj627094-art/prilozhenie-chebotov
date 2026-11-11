import type { TaskFilter } from "@/types/task";
import styles from "./TaskFilters.module.css";

const options: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "done", label: "Выполненные" },
];

interface TaskFiltersProps {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
}

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <div className={styles.filters}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? styles.active : undefined}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
