"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getToday = () => format(new Date(), "EEEE, d MMMM", { locale: ru });
const getServerToday = () => "";

// дата берётся из часов пользователя, поэтому считаем её только в браузере
export function TodayDate({ className }: { className?: string }) {
  const today = useSyncExternalStore(subscribe, getToday, getServerToday);

  return <p className={className}>Сегодня: {today}</p>;
}
