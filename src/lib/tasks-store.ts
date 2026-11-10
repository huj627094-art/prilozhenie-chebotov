import type { Task } from "@/types/task";
import { isRunning } from "@/lib/time";

/**
 * Хранилище задач для useSyncExternalStore.
 * Источник правды — массив задач в памяти, каждое изменение пишется в localStorage.
 * Запущенный таймер хранит момент окончания (endsAt), поэтому после перезагрузки
 * страницы или ухода со вкладки оставшееся время считается от реальных часов.
 */

export interface TasksState {
  tasks: Task[];
  /** Текущее время, обновляется тикером, пока идёт хотя бы один таймер. */
  now: number;
}

const STORAGE_KEY = "task-flow:tasks:v1";
const TICK_MS = 250;

let state: TasksState | null = null;
/** Тикер остановлен, а таймеры шли — `now` устарел и обновится при следующем чтении. */
let stale = false;
let ticker: ReturnType<typeof setInterval> | null = null;

const listeners = new Set<() => void>();
const finishListeners = new Set<(tasks: Task[]) => void>();

// ——— localStorage ———

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    isCount(task.durationMs) &&
    isCount(task.remainingMs) &&
    (task.endsAt === null || isCount(task.endsAt)) &&
    typeof task.done === "boolean" &&
    isCount(task.createdAt)
  );
}

function readStorage(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isTask)
      .map((task) => ({ ...task, remainingMs: Math.min(task.remainingMs, task.durationMs) }));
  } catch {
    return [];
  }
}

function writeStorage(tasks: Task[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // переполнено хранилище или приватный режим — работаем без сохранения
  }
}

// ——— таймеры ———

/** Останавливает таймеры, у которых вышло время. */
function settle(tasks: Task[], now: number): { tasks: Task[]; finished: Task[] } {
  const finished: Task[] = [];
  const next = tasks.map((task) => {
    if (task.endsAt === null || task.endsAt > now) return task;
    const stopped = { ...task, remainingMs: 0, endsAt: null };
    finished.push(stopped);
    return stopped;
  });
  return finished.length ? { tasks: next, finished } : { tasks, finished };
}

function pause(task: Task, now: number): Task {
  if (task.endsAt === null) return task;
  return { ...task, remainingMs: Math.max(0, task.endsAt - now), endsAt: null };
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function tick(): void {
  if (!state) return;
  const now = Date.now();
  const { tasks, finished } = settle(state.tasks, now);
  state = { tasks, now };
  if (finished.length) writeStorage(tasks);
  emit();
  if (finished.length) finishListeners.forEach((listener) => listener(finished));
  syncTicker();
}

function syncTicker(): void {
  const shouldRun = listeners.size > 0 && state !== null && state.tasks.some(isRunning);
  if (shouldRun && ticker === null) ticker = setInterval(tick, TICK_MS);
  if (!shouldRun && ticker !== null) {
    clearInterval(ticker);
    ticker = null;
  }
}

function loadFromStorage(): TasksState {
  const now = Date.now();
  const stored = readStorage();
  const { tasks, finished } = settle(stored, now);
  if (finished.length) writeStorage(tasks);
  return { tasks, now };
}

function ensureState(): TasksState {
  if (state === null) {
    state = loadFromStorage();
  } else if (stale) {
    const now = Date.now();
    const { tasks, finished } = settle(state.tasks, now);
    if (finished.length) writeStorage(tasks);
    state = { tasks, now };
  }
  stale = false;
  return state;
}

function commit(update: (tasks: Task[], now: number) => Task[]): void {
  const current = ensureState();
  const now = Date.now();
  const tasks = update(settle(current.tasks, now).tasks, now);
  state = { tasks, now };
  writeStorage(tasks);
  emit();
  syncTicker();
}

// ——— синхронизация между вкладками ———

function handleStorage(event: StorageEvent): void {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  state = loadFromStorage();
  emit();
  syncTicker();
}

// ——— API для useSyncExternalStore ———

export function subscribeTasks(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  syncTicker();

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    window.removeEventListener("storage", handleStorage);
    if (ticker !== null) stale = true;
    syncTicker();
  };
}

export function getTasksSnapshot(): TasksState {
  return ensureState();
}

/** На сервере и при гидратации localStorage недоступен — показываем заглушку. */
export function getServerTasksSnapshot(): TasksState | null {
  return null;
}

export function onTimerFinished(listener: (tasks: Task[]) => void): () => void {
  finishListeners.add(listener);
  return () => {
    finishListeners.delete(listener);
  };
}

// ——— действия ———

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

const updateTask = (id: string, update: (task: Task, now: number) => Task) =>
  commit((tasks, now) => tasks.map((task) => (task.id === id ? update(task, now) : task)));

export function addTask(title: string, durationMs: number): void {
  commit((tasks, now) => [
    { id: createId(), title, durationMs, remainingMs: durationMs, endsAt: null, done: false, createdAt: now },
    ...tasks,
  ]);
}

export function renameTask(id: string, title: string): void {
  updateTask(id, (task) => ({ ...task, title }));
}

export function toggleTask(id: string): void {
  updateTask(id, (task, now) => ({ ...pause(task, now), done: !task.done }));
}

export function deleteTask(id: string): void {
  commit((tasks) => tasks.filter((task) => task.id !== id));
}

export function clearCompleted(): void {
  commit((tasks) => tasks.filter((task) => !task.done));
}

export function startTimer(id: string): void {
  updateTask(id, (task, now) =>
    task.done || task.endsAt !== null || task.remainingMs <= 0 ? task : { ...task, endsAt: now + task.remainingMs },
  );
}

export function pauseTimer(id: string): void {
  updateTask(id, (task, now) => pause(task, now));
}

export function resetTimer(id: string): void {
  updateTask(id, (task) => ({ ...task, remainingMs: task.durationMs, endsAt: null }));
}
