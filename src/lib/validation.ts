export const MAX_TITLE_LENGTH = 120;
export const MAX_MINUTES = 999;

export interface TaskDraft {
  title: string;
  minutes: string;
  seconds: string;
}

export type DraftErrors = Partial<Record<keyof TaskDraft, string>>;

type DraftResult =
  | { ok: true; title: string; durationMs: number }
  | { ok: false; errors: DraftErrors };

type FieldResult = { value: number } | { error: string };

function parseTimeField(raw: string, max: number, overflowMessage: string): FieldResult {
  const value = raw.trim();
  if (value === "") return { value: 0 };
  if (!/^[+-]?\d+$/.test(value)) return { error: "Введите целое число" };

  const number = Number(value);
  if (number < 0) return { error: "Время не может быть отрицательным" };
  if (number > max) return { error: overflowMessage };
  return { value: number };
}

export function validateDraft(draft: TaskDraft): DraftResult {
  const errors: DraftErrors = {};
  const title = draft.title.trim();

  if (title === "") errors.title = "Введите название задачи";
  else if (title.length > MAX_TITLE_LENGTH) errors.title = `Не длиннее ${MAX_TITLE_LENGTH} символов`;

  const minutes = parseTimeField(draft.minutes, MAX_MINUTES, `Не больше ${MAX_MINUTES} минут`);
  const seconds = parseTimeField(draft.seconds, 59, "Секунд не может быть больше 59");

  if ("error" in minutes) errors.minutes = minutes.error;
  if ("error" in seconds) errors.seconds = seconds.error;

  if ("error" in minutes || "error" in seconds || errors.title) return { ok: false, errors };

  return { ok: true, title, durationMs: (minutes.value * 60 + seconds.value) * 1000 };
}
