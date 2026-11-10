import { cx } from "@/lib/cx";
import { formatTimer } from "@/lib/time";
import type { TaskStatus } from "@/types/task";
import styles from "./TaskTimer.module.css";

interface TaskTimerProps {
  remainingMs: number;
  status: TaskStatus;
  className?: string;
}

export function TaskTimer({ remainingMs, status, className }: TaskTimerProps) {
  const value = formatTimer(remainingMs);
  const [minutes, seconds] = value.split(":");

  return (
    <span
      role="timer"
      className={cx(styles.timer, styles[status], className)}
      aria-label={`Осталось ${Number(minutes)} мин ${Number(seconds)} сек`}
    >
      {value}
    </span>
  );
}
