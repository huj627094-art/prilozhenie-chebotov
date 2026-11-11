"use client";

import { primeChime } from "@/lib/chime";
import { pauseTimer, startTimer } from "@/lib/tasks-store";
import styles from "./TimerToggle.module.css";

interface TimerToggleProps {
  taskId: string;
  title: string;
  running: boolean;
  disabled: boolean;
}

export function TimerToggle({ taskId, title, running, disabled }: TimerToggleProps) {
  function handleClick() {
    if (running) {
      pauseTimer(taskId);
    } else {
      primeChime();
      startTimer(taskId);
    }
  }

  return (
    <button
      type="button"
      className={running ? styles.pause : styles.start}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`${running ? "Пауза" : "Старт"}: ${title}`}
    >
      {running ? "Пауза" : "Старт"}
    </button>
  );
}
