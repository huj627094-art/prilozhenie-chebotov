import type { Metadata } from "next";
import { author, features, stack } from "@/data/about";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "О приложении",
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <h1>О приложении</h1>
      <p>
        Task Flow — это простой менеджер задач с таймером. Можно добавить задачу, указать сколько времени на неё нужно
        и запустить обратный отсчёт. Все задачи сохраняются в браузере, поэтому после перезагрузки страницы они не
        пропадают.
      </p>

      <h2>Что умеет</h2>
      <ul>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <h2>Технологии</h2>
      <ul>
        {stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Автор</h2>
      <p>
        {author.name} — {author.role}
      </p>
      <p>
        <a href={author.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
    </div>
  );
}
