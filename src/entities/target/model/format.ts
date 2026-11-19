import { formatPercent } from "@/shared/lib";

export const NO_DATA = "нет данных";

// whole: целые проценты без округления вверх, чтобы 99,9% не превращались в 100%.
export function formatUptime(
  value: number | null,
  { whole = false }: { whole?: boolean } = {},
): string {
  if (value === null) {
    return NO_DATA;
  }

  const percent = Math.round(value * 1000) / 10;

  return whole
    ? formatPercent(Math.trunc(percent), { maxDigits: 0 })
    : formatPercent(percent, { minDigits: 1 });
}
