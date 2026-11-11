"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { addTask } from "@/lib/tasks-store";
import { MAX_TITLE_LENGTH, validateDraft, type TaskDraft } from "@/lib/validation";
import styles from "./TaskForm.module.css";

const EMPTY_DRAFT: TaskDraft = { title: "", minutes: "", seconds: "" };

export function TaskForm() {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const result = validateDraft(draft);
  // ошибки показываем после первой попытки отправки
  const errors = submitted && !result.ok ? result.errors : {};
  const messages = Object.values(errors);

  const change = (field: keyof TaskDraft) => (event: ChangeEvent<HTMLInputElement>) =>
    setDraft((current) => ({ ...current, [field]: event.target.value }));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!result.ok) {
      setSubmitted(true);
      const { errors: invalid } = result;
      const firstInvalid = invalid.title ? titleRef : invalid.minutes ? minutesRef : secondsRef;
      firstInvalid.current?.focus();
      return;
    }

    addTask(result.title, result.durationMs);
    setDraft(EMPTY_DRAFT);
    setSubmitted(false);
    titleRef.current?.focus();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <input
        ref={titleRef}
        className={styles.title}
        value={draft.title}
        onChange={change("title")}
        placeholder="Добавить задачу..."
        maxLength={MAX_TITLE_LENGTH}
        autoComplete="off"
        aria-label="Название задачи"
        aria-invalid={Boolean(errors.title)}
      />

      <label className={styles.time}>
        <input
          ref={minutesRef}
          className={styles.number}
          value={draft.minutes}
          onChange={change("minutes")}
          placeholder="0"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Минуты"
          aria-invalid={Boolean(errors.minutes)}
        />
        мин
      </label>

      <label className={styles.time}>
        <input
          ref={secondsRef}
          className={styles.number}
          value={draft.seconds}
          onChange={change("seconds")}
          placeholder="0"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Секунды"
          aria-invalid={Boolean(errors.seconds)}
        />
        сек
      </label>

      <button type="submit" className={styles.add}>
        Добавить
      </button>

      {messages.length > 0 && (
        <ul className={styles.errors} role="alert">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
