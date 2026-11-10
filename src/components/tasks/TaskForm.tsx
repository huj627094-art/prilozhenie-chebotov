"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { cx } from "@/lib/cx";
import { addTask } from "@/lib/tasks-store";
import { MAX_TITLE_LENGTH, validateDraft, type TaskDraft } from "@/lib/validation";
import styles from "./TaskForm.module.css";

const EMPTY_DRAFT: TaskDraft = { title: "", minutes: "", seconds: "" };
const PRESETS = [5, 15, 25, 45];
const ERRORS_ID = "task-form-errors";

export function TaskForm() {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const result = validateDraft(draft);
  // Ошибки показываем после первой попытки отправки и дальше обновляем на лету.
  const errors = submitted && !result.ok ? result.errors : {};
  const messages = Object.values(errors);

  const change = (field: keyof TaskDraft) => (event: ChangeEvent<HTMLInputElement>) =>
    setDraft((current) => ({ ...current, [field]: event.target.value }));

  const describe = (field: keyof TaskDraft) =>
    errors[field] ? { "aria-invalid": true, "aria-describedby": ERRORS_ID } : {};

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

  function applyPreset(minutes: number) {
    setDraft((current) => ({ ...current, minutes: String(minutes), seconds: "" }));
    // Возвращаем фокус в название, чтобы Enter сразу добавил задачу.
    titleRef.current?.focus();
  }

  const minutesValue = draft.minutes.trim();
  const secondsEmpty = draft.seconds.trim() === "" || Number(draft.seconds) === 0;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Новая задача">
      <div className={styles.row}>
        <label className={styles.titleField}>
          <span className="visually-hidden">Название задачи</span>
          <input
            ref={titleRef}
            className={cx(styles.input, errors.title && styles.invalid)}
            value={draft.title}
            onChange={change("title")}
            placeholder="Что нужно сделать?"
            maxLength={MAX_TITLE_LENGTH}
            autoComplete="off"
            enterKeyHint="done"
            {...describe("title")}
          />
        </label>

        <fieldset className={cx(styles.time, (errors.minutes || errors.seconds) && styles.invalid)}>
          <legend className="visually-hidden">Время на задачу</legend>
          <label className={styles.unit}>
            <input
              ref={minutesRef}
              className={styles.timeInput}
              value={draft.minutes}
              onChange={change("minutes")}
              placeholder="00"
              inputMode="numeric"
              autoComplete="off"
              aria-label="Минуты"
              {...describe("minutes")}
            />
            <span aria-hidden="true">мин</span>
          </label>
          <span className={styles.colon} aria-hidden="true">
            :
          </span>
          <label className={styles.unit}>
            <input
              ref={secondsRef}
              className={styles.timeInput}
              value={draft.seconds}
              onChange={change("seconds")}
              placeholder="00"
              inputMode="numeric"
              autoComplete="off"
              aria-label="Секунды"
              {...describe("seconds")}
            />
            <span aria-hidden="true">сек</span>
          </label>
        </fieldset>

        <button type="submit" className={styles.submit}>
          <PlusIcon />
          <span>Добавить</span>
        </button>
      </div>

      <div className={styles.presets} role="group" aria-label="Быстрый выбор времени">
        <span className={styles.presetsLabel}>Быстро:</span>
        {PRESETS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={styles.preset}
            aria-pressed={minutesValue === String(minutes) && secondsEmpty}
            onClick={() => applyPreset(minutes)}
          >
            {minutes} мин
          </button>
        ))}
      </div>

      <ul id={ERRORS_ID} className={styles.errors} aria-live="polite">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </form>
  );
}
