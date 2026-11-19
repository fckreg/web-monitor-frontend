import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/entities/session/index.server";
import { LoginForm } from "@/features/login";
import { routes } from "@/shared/config";
import { closedPageMetadata } from "@/shared/seo";
import { Card } from "@/shared/ui";

export const metadata = closedPageMetadata({
  title: "Вход",
  description: "Вход в закрытую зону, где настраиваются проверки сайтов.",
});

export function LoginPage() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Card className="w-full max-w-md">
        <p className="text-sm text-muted">Закрытая зона</p>
        <h1 className="mb-6 text-2xl font-semibold">Вход</h1>
        <Suspense fallback={<p className="type-note">Проверяем сессию…</p>}>
          <LoginGate />
        </Suspense>
      </Card>
      <Link href={routes.home} className="type-note hover:text-ink">
        <span aria-hidden>← </span>К проверкам сайтов
      </Link>
    </main>
  );
}

async function LoginGate() {
  if (await getSession()) {
    redirect(routes.targets);
  }

  return <LoginForm />;
}
