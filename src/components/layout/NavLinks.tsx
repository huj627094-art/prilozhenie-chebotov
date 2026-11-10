"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "/", label: "Задачи" },
  { href: "/about", label: "О приложении" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация">
      <ul className={styles.nav}>
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cx(styles.link, active && styles.linkActive)}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
