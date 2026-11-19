"use client";

import { type FormEvent, useState } from "react";

import { useApiAction } from "@/shared/api";
import { Button, Field, FormError, Input } from "@/shared/ui";

export function CodeStep({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const { run, pending, error } = useApiAction();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (await run("/auth/totp", "POST", { code }, { refresh: false })) {
      onSuccess();
    }
  }

  return (
    <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
      <Field
        label="Код"
        hint="Код из приложения-аутентификатора или одноразовый код восстановления."
      >
        {(control) => (
          <Input
            {...control}
            autoComplete="one-time-code"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={64}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        )}
      </Field>
      <FormError>{error}</FormError>
      <Button type="submit" disabled={pending || code.trim().length < 6}>
        {pending ? "Проверка…" : "Войти"}
      </Button>
    </form>
  );
}
