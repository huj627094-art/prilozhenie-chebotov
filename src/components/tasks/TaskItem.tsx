"use client";

import { memo, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { deleteTask, renameTask, resetTimer, toggleTask } from "@/lib/tasks-store";
import { getRemaining, getStatus } from "@/lib/time";
import type { Task } from "@/types/task";
import { TaskTimer } from "./TaskTimer";
import { TaskTitle } from "./TaskTitle";
import { TimerToggle } from "./TimerToggle";
import styles from "./TaskItem.module.css";

interface TaskItemProps {
  task: Task;
  // для незапущенных задач приходит 0, чтобы они не перерисовывались каждый тик
  now: number;
}

function TaskItemBase({ task, now }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);

  const remaining = getRemaining(task, now);
  const status = getStatus(task, remaining);
  const canReset = !task.done && task.durationMs > 0 && (status === "running" || remaining < task.durationMs);

  function finishEditing(title: string | null, restoreFocus: boolean) {
    if (title !== null) renameTask(task.id, title);
    setEditing(false);
    if (restoreFocus) requestAnimationFrame(() => editButton.current?.focus());
  }

  return (
    <li className={cx(styles.item, task.done && styles.done)}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={task.done}
        onChange={() => toggleTask(task.id)}
        aria-label={`Выполнено: ${task.title}`}
      />

      <div className={styles.text}>
        <TaskTitle
          title={task.title}
          done={task.done}
          editing={editing}
          onStartEditing={() => setEditing(true)}
          onFinishEditing={finishEditing}
        />
        {status === "expired" && <span className={styles.expired}>Время вышло</span>}
      </div>

      <TaskTimer remainingMs={remaining} status={status} />

      <div className={styles.buttons}>
        <TimerToggle
          taskId={task.id}
          title={task.title}
          running={status === "running"}
          disabled={task.done || remaining <= 0}
        />
        <button type="button" onClick={() => resetTimer(task.id)} disabled={!canReset}>
          Сброс
        </button>
        <button type="button" ref={editButton} onClick={() => setEditing(true)} disabled={editing}>
          Изменить
        </button>
        <button type="button" className={styles.delete} onClick={() => deleteTask(task.id)}>
          Удалить
        </button>
      </div>
    </li>
  );
}

export const TaskItem = memo(TaskItemBase);
