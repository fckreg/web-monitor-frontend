import { formatUptime } from "./format";
import { PROBE_NOTICE, STATUS_LABEL } from "./status";
import type { PublicTargetDetail } from "./types";

export function publicTargetDescription(
  detail: Pick<PublicTargetDetail, "name" | "state" | "uptime_24h" | "group_name">,
): string {
  const uptime =
    detail.uptime_24h === null
      ? "За последние сутки данных ещё нет."
      : `За последние сутки ответ приходил в ${formatUptime(detail.uptime_24h)} проверок.`;
  const group = detail.group_name ? ` Группа «${detail.group_name}».` : "";

  return `${detail.name}: сейчас ${STATUS_LABEL[detail.state]}. ${uptime}${group} ${PROBE_NOTICE}`;
}
