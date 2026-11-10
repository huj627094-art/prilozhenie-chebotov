export interface Task {
  id: string;
  title: string;
  /** Исходная длительность таймера, мс. */
  durationMs: number;
  /** Остаток времени на момент последней паузы, мс. */
  remainingMs: number;
  /** Момент окончания отсчёта, пока таймер запущен (epoch, мс). */
  endsAt: number | null;
  done: boolean;
  createdAt: number;
}

export type TaskFilter = "all" | "active" | "done";

export type TaskStatus = "done" | "untimed" | "running" | "expired" | "paused" | "idle";
