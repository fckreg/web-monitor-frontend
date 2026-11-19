import { redirect } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { getSession } from "@/entities/session/index.server";
import { routes } from "@/shared/config";
import { AppHeader } from "@/widgets/app-header";

export function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <SessionShell>{children}</SessionShell>
    </Suspense>
  );
}

async function SessionShell({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect(routes.login);
  }

  return (
    <div className="min-h-screen">
      <AppHeader username={session.username} />
      <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8">
        {children}
      </main>
    </div>
  );
}

function ShellFallback() {
  return (
    <div className="min-h-screen">
      <div className="h-header bg-panel" />
      <p role="status" className="sr-only">
        Загрузка…
      </p>
    </div>
  );
}
