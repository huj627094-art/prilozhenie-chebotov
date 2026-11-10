"use client";

import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { primeChime } from "@/lib/chime";
import { cx } from "@/lib/cx";
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
      className={cx(styles.toggle, running && styles.running)}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`${running ? "Пауза" : "Запустить таймер"}: ${title}`}
      title={running ? "Пауза" : "Запустить"}
    >
      {running ? <PauseIcon /> : <PlayIcon />}
    </button>
  );
}
