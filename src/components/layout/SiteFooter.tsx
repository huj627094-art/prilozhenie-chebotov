import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p className="container">Task Flow · задачи хранятся только в этом браузере</p>
    </footer>
  );
}
