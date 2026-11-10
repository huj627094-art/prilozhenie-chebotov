"use client";

import { memo, useRef, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { PencilIcon, ResetIcon, TrashIcon } from "@/components/ui/icons";
import { cx } from "@/lib/cx";
import { deleteTask, renameTask, resetTimer, toggleTask } from "@/lib/tasks-store";
import { formatTimer, getRemaining, getStatus } from "@/lib/time";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCheckbox } from "./TaskCheckbox";
import { TaskTimer } from "./TaskTimer";
import { TaskTitle } from "./TaskTitle";
import { TimerToggle } from "./TimerToggle";
import styles from "./TaskItem.module.css";

const statusLabels: Record<TaskStatus, string> = {
  done: "Выполнено",
  untimed: "Без таймера",
  running: "Идёт отсчёт",
  expired: "Время вышло",
  paused: "На паузе",
  idle: "Не начата",
};

interface TaskItemProps {
  task: Task;
  /** Текущее время; для незапущенных задач 0, чтобы memo не перерисовывал их на каждом тике. */
  now: number;
}

function TaskItemBase({ task, now }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);

  const remaining = getRemaining(task, now);
  const status = getStatus(task, remaining);
  const hasTimer = task.durationMs > 0;
  const canReset = !task.done && hasTimer && (status === "running" || remaining < task.durationMs);

  function finishEditing(title: string | null, restoreFocus: boolean) {
    if (title !== null) renameTask(task.id, title);
    setEditing(false);
    if (restoreFocus) requestAnimationFrame(() => editButton.current?.focus());
  }

  return (
    <li className={cx(styles.item, styles[status])}>
      <TaskCheckbox title={task.title} checked={task.done} onChange={() => toggleTask(task.id)} />

      <div className={styles.body}>
        <TaskTitle
          title={task.title}
          done={task.done}
          editing={editing}
          onStartEditing={() => setEditing(true)}
          onFinishEditing={finishEditing}
        />
        <p className={styles.meta}>
          <span className={styles.dot} aria-hidden="true" />
          {statusLabels[status]}
          {hasTimer && <span className={styles.total}>из {formatTimer(task.durationMs)}</span>}
        </p>
      </div>

      <TaskTimer className={styles.timer} remainingMs={remaining} status={status} />

      <div className={styles.actions}>
        <TimerToggle
          taskId={task.id}
          title={task.title}
          running={status === "running"}
          disabled={task.done || remaining <= 0}
        />
        <IconButton label="Сбросить таймер" disabled={!canReset} onClick={() => resetTimer(task.id)}>
          <ResetIcon />
        </IconButton>
        <IconButton ref={editButton} label="Переименовать" disabled={editing} onClick={() => setEditing(true)}>
          <PencilIcon />
        </IconButton>
        <IconButton label="Удалить задачу" tone="danger" onClick={() => deleteTask(task.id)}>
          <TrashIcon />
        </IconButton>
      </div>

      {hasTimer && (
        <span className={styles.progress} aria-hidden="true">
          <span style={{ transform: `scaleX(${remaining / task.durationMs})` }} />
        </span>
      )}
    </li>
  );
}

export const TaskItem = memo(TaskItemBase);
