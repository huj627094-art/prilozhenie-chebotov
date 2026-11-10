"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import { MAX_TITLE_LENGTH } from "@/lib/validation";
import styles from "./TaskTitle.module.css";

interface TaskTitleProps {
  title: string;
  done: boolean;
  editing: boolean;
  onStartEditing: () => void;
  /** `title === null` — переименование отменено. */
  onFinishEditing: (title: string | null, restoreFocus: boolean) => void;
}

export function TaskTitle({ title, done, editing, onStartEditing, onFinishEditing }: TaskTitleProps) {
  if (editing) return <TitleEditor initial={title} onFinish={onFinishEditing} />;

  return (
    <p className={cx(styles.title, done && styles.done)} onDoubleClick={onStartEditing}>
      {title}
    </p>
  );
}

function TitleEditor({ initial, onFinish }: { initial: string; onFinish: TaskTitleProps["onFinishEditing"] }) {
  const [value, setValue] = useState(initial);
  const input = useRef<HTMLInputElement>(null);
  const finished = useRef(false);

  useEffect(() => {
    input.current?.focus();
    input.current?.select();
  }, []);

  function finish(save: boolean, restoreFocus: boolean) {
    if (finished.current) return;
    finished.current = true;
    const next = value.trim();
    // Пустое или неизменённое название не сохраняем — остаётся прежнее.
    onFinish(save && next !== "" && next !== initial ? next : null, restoreFocus);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      finish(true, true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      finish(false, true);
    }
  }

  return (
    <input
      ref={input}
      className={styles.input}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => finish(true, false)}
      onKeyDown={handleKeyDown}
      maxLength={MAX_TITLE_LENGTH}
      aria-label="Новое название задачи"
      enterKeyHint="done"
    />
  );
}
