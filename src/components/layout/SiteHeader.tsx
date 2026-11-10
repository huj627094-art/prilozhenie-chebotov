import Link from "next/link";
import { LogoMark } from "@/components/ui/icons";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Task Flow — на главную">
          <LogoMark className={styles.logo} />
          <span>
            Task<span className={styles.brandAccent}>Flow</span>
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
