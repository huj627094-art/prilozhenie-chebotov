import { useSyncExternalStore } from "react";
import { getServerTasksSnapshot, getTasksSnapshot, subscribeTasks } from "@/lib/tasks-store";

/** Задачи и текущее время. `null` — данные из localStorage ещё не прочитаны (SSR и гидратация). */
export function useTasks() {
  return useSyncExternalStore(subscribeTasks, getTasksSnapshot, getServerTasksSnapshot);
}
