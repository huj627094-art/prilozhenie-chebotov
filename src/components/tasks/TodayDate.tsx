"use client";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getToday = () => format(new Date(), "yyyy-MM-dd");
const getServerToday = () => null;

/** Дата берётся из часов пользователя, поэтому рендерится только в браузере. */
export function TodayDate({ className }: { className?: string }) {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday);

  return (
    <p className={className}>
      {today ? <time dateTime={today}>{format(parseISO(today), "EEEE, d MMMM", { locale: ru })}</time> : " "}
    </p>
  );
}
