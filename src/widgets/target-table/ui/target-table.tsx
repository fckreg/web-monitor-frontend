"use client";

import type { GroupRef } from "@/entities/group";
import { SiteMark, STATUS_LABEL, type Target, targetIconSrc } from "@/entities/target";
import { DeleteTargetButton } from "@/features/target-delete";
import { EditTargetButton } from "@/features/target-edit";
import { TargetToggle } from "@/features/target-toggle";
import { formatDateTime } from "@/shared/lib";
import { Badge } from "@/shared/ui";

export function TargetTable({ targets, groups }: { targets: Target[]; groups: GroupRef[] }) {
  if (targets.length === 0) {
    return <p className="text-sm text-muted">Список целей пуст. Добавьте первый сайт.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-muted">
          <tr>
            <th className="py-2 pr-3 font-medium">Имя</th>
            <th className="py-2 pr-3 font-medium">URL</th>
            <th className="py-2 pr-3 font-medium">Интервал</th>
            <th className="py-2 pr-3 font-medium">Статус</th>
            <th className="py-2 pr-3 font-medium">Проверка</th>
            <th className="py-2 pr-3 font-medium">Флаги</th>
            <th className="py-2 font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {targets.map((target) => (
            <tr key={target.id} className="border-t border-line align-top">
              <td className="py-3 pr-3 font-medium">
                <span className="inline-flex items-center gap-2">
                  <SiteMark name={target.name} src={targetIconSrc(target.id)} />
                  {target.name}
                </span>
              </td>
              <td className="max-w-56 py-3 pr-3 break-all">{target.url}</td>
              <td className="py-3 pr-3 whitespace-nowrap">{target.interval_seconds} с</td>
              <td className="py-3 pr-3">
                <Badge tone={target.last_state}>{STATUS_LABEL[target.last_state]}</Badge>
                <p className="mt-1 text-xs text-muted">
                  {target.expected_status === null ? "любой 2xx" : `код ${target.expected_status}`}
                </p>
              </td>
              <td className="py-3 pr-3 whitespace-nowrap">
                {target.last_checked_at ? formatDateTime(target.last_checked_at) : "нет проверок"}
                {target.last_latency_ms !== null ? (
                  <p className="text-xs text-muted">{target.last_latency_ms} мс</p>
                ) : null}
              </td>
              <td className="space-y-2 py-3 pr-3">
                <TargetToggle
                  id={target.id}
                  checked={target.enabled}
                  field="enabled"
                  label="Включена"
                />
                <TargetToggle
                  id={target.id}
                  checked={target.is_public}
                  field="is_public"
                  label="На главной"
                />
              </td>
              <td className="space-y-2 py-3">
                <EditTargetButton target={target} groups={groups} />
                <DeleteTargetButton id={target.id} name={target.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
