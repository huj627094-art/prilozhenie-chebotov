import { CheckIcon } from "@/components/ui/icons";
import styles from "./TaskCheckbox.module.css";

interface TaskCheckboxProps {
  title: string;
  checked: boolean;
  onChange: () => void;
}

export function TaskCheckbox({ title, checked, onChange }: TaskCheckboxProps) {
  return (
    <label className={styles.box} title={checked ? "Вернуть в работу" : "Отметить выполненной"}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        aria-label={`Выполнено: ${title}`}
      />
      <span className={styles.mark} aria-hidden="true">
        <CheckIcon width="16" height="16" />
      </span>
    </label>
  );
}
