"use client";

import { useRouter } from "next/navigation";

import { useApiAction } from "@/shared/api";
import { routes } from "@/shared/config";
import { Button } from "@/shared/ui";

export function LogoutButton() {
  const router = useRouter();
  const { run, pending, error } = useApiAction();

  async function logout() {
    if (await run("/auth/logout", "POST", undefined, { refresh: false })) {
      router.replace(routes.login);
      router.refresh();
    }
  }

  return (
    <Button
      variant="ghost"
      className="border-panel-button-line bg-panel-button text-on-panel hover:bg-panel-button-hover"
      disabled={pending}
      title={error ?? undefined}
      onClick={() => void logout()}
    >
      {error ? "Повторить выход" : "Выход"}
    </Button>
  );
}
