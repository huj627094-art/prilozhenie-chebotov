"use client";

import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { playChime } from "@/lib/chime";
import { onTimerFinished } from "@/lib/tasks-store";
import type { Task, TaskFilter } from "@/types/task";
import { TaskFooter } from "./TaskFooter";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { TodayDate } from "./TodayDate";
import styles from "./TaskBoard.module.css";

const filters: Record<TaskFilter, (task: Task) => boolean> = {
  all: () => true,
  active: (task) => !task.done,
  done: (task) => task.done,
};

export function TaskBoard() {
  const state = useTasks();
  const [filter, setFilter] = useState<TaskFilter>("all");

  // звуковой сигнал, когда у задачи заканчивается время
  useEffect(() => onTimerFinished(() => playChime()), []);

  const tasks = state?.tasks ?? [];
  const activeCount = tasks.filter(filters.active).length;
  const doneCount = tasks.length - activeCount;

  return (
    <div>
      <h1 className={styles.title}>Мои задачи</h1>
      <TodayDate className={styles.date} />

      <TaskForm />

      <div className={styles.box}>
        {state ? (
          <TaskList tasks={tasks.filter(filters[filter])} now={state.now} filter={filter} hasTasks={tasks.length > 0} />
        ) : (
          <p className={styles.loading}>Загрузка...</p>
        )}
        {tasks.length > 0 && (
          <TaskFooter activeCount={activeCount} doneCount={doneCount} filter={filter} onFilterChange={setFilter} />
        )}
      </div>
    </div>
  );
}
