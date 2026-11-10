import type { TasksState } from "@/lib/tasks-store";
import { plural } from "@/lib/plural";
import { formatTotal, getRemaining, isRunning } from "@/lib/time";
import { cx } from "@/lib/cx";
import { TodayDate } from "./TodayDate";
import styles from "./TaskHero.module.css";

export function TaskHero({ state }: { state: TasksState | null }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heading}>
        <TodayDate className={styles.date} />
        <h1 className={styles.title}>Сегодня</h1>
      </div>
      <TaskSummary state={state} />
    </section>
  );
}

function TaskSummary({ state }: { state: TasksState | null }) {
  const tasks = state?.tasks ?? [];
  const active = tasks.filter((task) => !task.done);
  const done = tasks.length - active.length;
  const left = active.reduce((sum, task) => sum + getRemaining(task, state?.now ?? 0), 0);
  const running = active.some(isRunning);
  const ratio = tasks.length ? done / tasks.length : 0;

  return (
    <div className={cx(styles.summary, !state && styles.loading)} aria-busy={!state}>
      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>{plural(active.length, ["активная", "активные", "активных"])}</dt>
          <dd>{active.length}</dd>
        </div>
        <div className={styles.stat}>
          <dt>выполнено</dt>
          <dd>
            {done}
            <span className={styles.of}>/{tasks.length}</span>
          </dd>
        </div>
        <div className={styles.stat}>
          <dt>
            {running && <span className={styles.pulse} aria-hidden="true" />}
            осталось
          </dt>
          <dd className={styles.mono}>{formatTotal(left)}</dd>
        </div>
      </dl>
      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Выполнено задач"
        aria-valuemin={0}
        aria-valuemax={tasks.length}
        aria-valuenow={done}
      >
        <span style={{ transform: `scaleX(${ratio})` }} />
      </div>
    </div>
  );
}
