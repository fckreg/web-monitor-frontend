"use client";

import { type ReactNode, useId, useState } from "react";

import { cn } from "@/shared/lib";

import { ScrollArea } from "./scroll-area";

export function ChartValues({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const anchor = `--chart-values-${uid}`;
  const panelId = `chart-values-${uid}`;
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("mt-4", className)}>
      <button
        type="button"
        popoverTarget={panelId}
        aria-expanded={open}
        style={{ anchorName: anchor }}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-3 rounded-control border border-line bg-paper px-3 py-2.5 text-left text-sm font-light text-ink hover:bg-canvas focus-visible:outline-offset-[-2px]",
          open && "bg-canvas",
        )}
      >
        <span>{label}</span>
        <svg
          viewBox="0 0 16 16"
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
          aria-hidden
        >
          <path
            d="M4 6.25 8 10.25 12 6.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        id={panelId}
        popover="auto"
        onToggle={(event) => setOpen(event.newState === "open")}
        style={{
          positionAnchor: anchor,
          positionTryFallbacks: "flip-block",
          inset: "auto",
          top: "calc(anchor(bottom) + 0.25rem)",
          left: "anchor(left)",
          width: "anchor-size(width)",
          margin: 0,
        }}
        className="overflow-hidden rounded-control border border-line bg-paper shadow-overlay"
      >
        <ScrollArea label={label} className="max-h-52 overflow-y-auto px-3">
          <ul className="text-sm font-light">{children}</ul>
        </ScrollArea>
      </div>
    </div>
  );
}

export function ChartValue({
  when,
  value,
  note,
  tone = "ink",
}: {
  when: string;
  value: string;
  note?: string;
  tone?: "ink" | "down" | "muted";
}) {
  return (
    <li className="border-t border-line py-2 first:border-t-0">
      <p className="flex items-baseline justify-between gap-4">
        <span className="text-muted">{when}</span>
        <span
          className={cn(
            "tabular-nums",
            tone === "down" && "text-down",
            tone === "muted" && "text-muted",
            tone === "ink" && "text-ink",
          )}
        >
          {value}
        </span>
      </p>
      {note ? <p className="mt-0.5 text-muted">{note}</p> : null}
    </li>
  );
}
