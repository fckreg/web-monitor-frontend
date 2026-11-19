import { z } from "zod";

import type { Target, TargetFormValues } from "./types";

export const emptyTargetForm: TargetFormValues = {
  name: "",
  url: "",
  expected_status: null,
  interval_seconds: 60,
  enabled: true,
  is_public: false,
  group_id: null,
};

export function toTargetFormValues(target: Target): TargetFormValues {
  return {
    name: target.name,
    url: target.url,
    expected_status: target.expected_status,
    interval_seconds: target.interval_seconds,
    enabled: target.enabled,
    is_public: target.is_public,
    group_id: target.group_id,
  };
}

export const targetFormSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя").max(200, "Имя слишком длинное"),
  url: z
    .string()
    .trim()
    .min(1, "Укажите URL")
    .refine((value) => {
      try {
        const url = new URL(value);

        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "Нужен URL со схемой http или https"),
  interval_seconds: z
    .number()
    .int("Интервал должен быть целым числом")
    .min(30, "Минимум 30 секунд")
    .max(86400, "Максимум 86400 секунд"),
  expected_status: z
    .number()
    .int("Код должен быть целым числом")
    .min(100, "Код от 100 до 599")
    .max(599, "Код от 100 до 599")
    .nullable(),
  enabled: z.boolean(),
  is_public: z.boolean(),
  group_id: z
    .string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Выберите группу")
    .nullable(),
});
