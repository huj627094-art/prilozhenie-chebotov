"use client";

import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { playChime } from "@/lib/chime";
import { onTimerFinished } from "@/lib/tasks-store";
import type { Task, TaskFilter } from "@/types/task";
import { TaskFooter } from "./TaskFooter";
import { TaskForm } from "./TaskForm";
import { TaskHero } from "./TaskHero";
import { TaskList, TaskListSkeleton } from "./TaskList";
import styles from "./TaskBoard.module.css";

const filters: Record<TaskFilter, (task: Task) => boolean> = {
  all: () => true,
  active: (task) => !task.done,
  done: (task) => task.done,
};

export function TaskBoard() {
  const state = useTasks();
  const [filter, setFilter] = useState<TaskFilter>("all");

  useEffect(() => onTimerFinished(() => playChime()), []);

  const tasks = state?.tasks ?? [];
  const activeCount = tasks.filter(filters.active).length;
  const doneCount = tasks.length - activeCount;

  return (
    <div className={styles.board}>
      <TaskHero state={state} />
      <TaskForm />

      <section className={styles.panel} aria-labelledby="task-list-title">
        <h2 id="task-list-title" className="visually-hidden">
          Список задач
        </h2>
        {state ? (
          <TaskList tasks={tasks.filter(filters[filter])} now={state.now} filter={filter} hasTasks={tasks.length > 0} />
        ) : (
          <TaskListSkeleton />
        )}
        {tasks.length > 0 && (
          <TaskFooter activeCount={activeCount} doneCount={doneCount} filter={filter} onFilterChange={setFilter} />
        )}
      </section>
    </div>
  );
}
