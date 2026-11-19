import type { MonitorState } from "./types";

export const STATUS_LABEL: Record<MonitorState, string> = {
  up: "ответ получен",
  down: "ответ не получен",
  unknown: "нет данных",
};

export const PROBE_NOTICE =
  "Мы проверяем сайт автоматически со своего сервера. Это не официальный статус сервиса.";
