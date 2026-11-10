import type { Metadata } from "next";
import Link from "next/link";
import { author, features, stack } from "@/data/about";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "О приложении",
  description: "Task Flow — планировщик личных задач с таймером. Что умеет приложение и кто его сделал.",
};

export default function AboutPage() {
  return (
    <div className={`container ${styles.page}`}>
      <section className={styles.intro}>
        <p className={styles.eyebrow}>О приложении</p>
        <h1 className={styles.title}>
          Список дел, у&nbsp;которого есть <span className={styles.accent}>время</span>
        </h1>
        <p className={styles.lead}>
          Task Flow помогает спланировать день: каждой задаче можно выделить несколько минут и запустить обратный
          отсчёт. Всё хранится в вашем браузере — без регистрации и сервера.
        </p>
        <Link href="/" className={styles.cta}>
          Перейти к задачам
        </Link>
      </section>

      <section aria-labelledby="features-title">
        <h2 id="features-title" className={styles.sectionTitle}>
          Что умеет
        </h2>
        <ul className={styles.features}>
          {features.map((feature, index) => (
            <li key={feature.title} className={styles.feature}>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.columns}>
        <section className={styles.card} aria-labelledby="stack-title">
          <h2 id="stack-title" className={styles.sectionTitle}>
            Технологии
          </h2>
          <ul className={styles.stack}>
            {stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.card} aria-labelledby="author-title">
          <h2 id="author-title" className={styles.sectionTitle}>
            Автор
          </h2>
          <p className={styles.authorName}>{author.name}</p>
          <p className={styles.authorRole}>{author.role}</p>
          <a className={styles.authorLink} href={author.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </section>
      </div>
    </div>
  );
}
