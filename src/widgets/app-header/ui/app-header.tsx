"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/features/logout";
import { RecoveryCodesButton } from "@/features/recovery-codes";
import { routes, SITE_NAME } from "@/shared/config";
import { cn } from "@/shared/lib";
import { BrandMark } from "@/shared/ui";

const links = [{ href: routes.targets, label: "Цели" }];

export function AppHeader({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-panel-line bg-panel text-on-panel">
      <div className="mx-auto flex h-header max-w-6xl items-center gap-4 px-4 sm:px-8">
        <Link
          href={routes.targets}
          className="flex shrink-0 items-center gap-2 text-base font-semibold"
        >
          <BrandMark />
          {SITE_NAME}
        </Link>
        <nav aria-label="Разделы" className="flex min-w-0 gap-1 overflow-x-auto">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-note px-3 py-1.5 text-sm whitespace-nowrap",
                  active
                    ? "bg-panel-active text-on-panel"
                    : "text-on-panel-muted hover:bg-panel-hover",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className="hidden text-sm text-on-panel-muted sm:inline">{username}</span>
          <RecoveryCodesButton />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
