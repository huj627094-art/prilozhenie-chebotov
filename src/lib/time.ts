import type { Task, TaskStatus } from "@/types/task";

const pad = (value: number) => String(value).padStart(2, "0");

const toSeconds = (ms: number) => Math.max(0, Math.ceil(ms / 1000));

/** Время задачи в формате MM:SS (минуты могут быть больше 99). */
export function formatTimer(ms: number): string {
  const total = toSeconds(ms);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** Суммарное время: MM:SS или H:MM:SS, если набралось больше часа. */
export function formatTotal(ms: number): string {
  const total = toSeconds(ms);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export function isRunning(task: Task): boolean {
  return task.endsAt !== null;
}

export function getRemaining(task: Task, now: number): number {
  return task.endsAt === null ? task.remainingMs : Math.max(0, task.endsAt - now);
}

export function getStatus(task: Task, remainingMs: number): TaskStatus {
  if (task.done) return "done";
  if (task.durationMs === 0) return "untimed";
  if (task.endsAt !== null) return "running";
  if (remainingMs <= 0) return "expired";
  if (remainingMs < task.durationMs) return "paused";
  return "idle";
}
