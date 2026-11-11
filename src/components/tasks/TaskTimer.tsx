import { cx } from "@/lib/cx";
import { formatTimer } from "@/lib/time";
import type { TaskStatus } from "@/types/task";
import styles from "./TaskTimer.module.css";

interface TaskTimerProps {
  remainingMs: number;
  status: TaskStatus;
}

export function TaskTimer({ remainingMs, status }: TaskTimerProps) {
  return (
    <span role="timer" className={cx(styles.timer, styles[status])}>
      {formatTimer(remainingMs)}
    </span>
  );
}
