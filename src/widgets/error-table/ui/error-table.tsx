import { useId } from "react";

import type { CheckError } from "@/entities/check";
import { formatDateTime } from "@/shared/lib";
import { Card, ScrollArea } from "@/shared/ui";

const TITLE = "Запросы без ожидаемого ответа";

export function ErrorTable({ items }: { items: CheckError[] }) {
  const titleId = useId();

  return (
    <Card className="p-4">
      <h2 id={titleId} className="type-section-title mb-3">
        {TITLE}
      </h2>
      {items.length === 0 ? (
        <p className="type-note">Таких запросов пока нет</p>
      ) : (
        <ScrollArea label={TITLE} className="overflow-x-auto">
          <table aria-labelledby={titleId} className="w-full text-left text-sm font-light">
            <thead className="text-muted">
              <tr>
                <th scope="col" className="py-2 pr-3 font-light">
                  Время
                </th>
                <th scope="col" className="py-2 pr-3 font-light">
                  Код
                </th>
                <th scope="col" className="py-2 font-light">
                  Ошибка
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="py-2 pr-3 whitespace-nowrap">{formatDateTime(item.checked_at)}</td>
                  <td className="py-2 pr-3">{item.status_code ?? "—"}</td>
                  <td className="py-2">{item.error || "ответ не получен"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )}
    </Card>
  );
}
