import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";

import { routes, SITE_NAME } from "@/shared/config";
import { BrandMark } from "@/shared/ui";

const MAIN_ID = "main";

const panelLink =
  "rounded-note px-3 py-1.5 text-sm text-on-panel-soft hover:bg-panel-hover hover:text-on-panel";

export function PublicFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href={`#${MAIN_ID}`}
        className="sr-only z-50 rounded-note bg-paper px-4 py-2 text-sm text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Перейти к содержимому
      </a>
      <header className="sticky top-0 z-30 border-b border-panel-line bg-panel text-on-panel">
        <div className="mx-auto flex h-header max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <Link href={routes.home} className="flex items-center gap-2 text-base font-semibold">
            <BrandMark />
            {SITE_NAME}
          </Link>
          <nav aria-label="Основная навигация">
            <Link href={routes.login} className={panelLink}>
              Вход
            </Link>
          </nav>
        </div>
      </header>
      <main
        id={MAIN_ID}
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 font-display antialiased outline-none sm:px-8"
      >
        {children}
      </main>
      <footer className="bg-panel text-on-panel-muted">
        <div className="mx-auto flex min-h-header max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 sm:px-8">
          <p className="text-sm">Проверяем сайты автоматически.</p>
          <div className="flex items-center gap-4">
            <nav aria-label="Дополнительная навигация">
              <Link href={routes.disclaimer} className={panelLink}>
                Правовая информация
              </Link>
            </nav>
            <p className="text-sm">
              <CurrentYear />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

async function CurrentYear() {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}
