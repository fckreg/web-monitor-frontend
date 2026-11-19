"use client";

import { useState } from "react";

export function CodeList({
  codes,
  copyLabel = "Скопировать коды",
}: {
  codes: string[];
  copyLabel?: string;
}) {
  const [note, setNote] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setNote("Скопировано");
    } catch {
      setNote("Скопируйте вручную");
    }
  }

  return (
    <div className="space-y-2">
      <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
        {codes.map((code) => (
          <li
            key={code}
            className="rounded-control border border-line px-2 py-1 break-all only:col-span-2"
          >
            {code}
          </li>
        ))}
      </ul>
      <button type="button" className="text-sm text-accent underline" onClick={() => void copy()}>
        {copyLabel}
      </button>
      <p role="status" className="text-sm text-muted">
        {note}
      </p>
    </div>
  );
}
