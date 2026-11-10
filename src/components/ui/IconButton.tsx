import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import styles from "./IconButton.module.css";

interface IconButtonProps extends ComponentProps<"button"> {
  label: string;
  tone?: "default" | "danger";
}

export function IconButton({ label, tone = "default", className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(styles.button, tone === "danger" && styles.danger, className)}
      {...props}
    >
      {children}
    </button>
  );
}
