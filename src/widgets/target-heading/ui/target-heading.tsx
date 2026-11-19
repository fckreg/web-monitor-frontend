import Link from "next/link";
import type { ReactNode } from "react";

import { type MonitorState, SiteMark, STATUS_LABEL } from "@/entities/target";
import { StatusWord } from "@/shared/ui";

export function TargetHeading({
  name,
  iconSrc,
  state,
  backHref,
  backLabel,
  children,
}: {
  name: string;
  iconSrc: string;
  state: MonitorState;
  backHref: string;
  backLabel: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <Link href={backHref} className="type-note hover:text-ink">
        <span aria-hidden>← </span>
        {backLabel}
      </Link>
      <div className="mt-4 flex items-start gap-3">
        <SiteMark name={name} src={iconSrc} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="type-page-title leading-none">{name}</h1>
            {children ? (
              <p className="rounded-full bg-plate px-3 py-1 text-sm font-light leading-none text-muted">
                {children}
              </p>
            ) : null}
          </div>
          <StatusWord tone={state} className="mt-2 block text-base">
            {STATUS_LABEL[state]}
          </StatusWord>
        </div>
      </div>
    </div>
  );
}
