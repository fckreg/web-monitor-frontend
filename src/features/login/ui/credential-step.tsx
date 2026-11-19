"use client";

import { type FormEvent, useState } from "react";

import { useApiAction } from "@/shared/api";
import { Button, Field, FormError, Input } from "@/shared/ui";

import { loginResultSchema } from "../model/schema";

export function CredentialStep({
  onSetup,
  onCode,
}: {
  onSetup: (secret: string) => void;
  onCode: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { runJson, pending, error } = useApiAction();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await runJson("/auth/login", "POST", { username, password }, loginResultSchema, {
      refresh: false,
    });

    if (!result) {
      return;
    }

    setPassword("");

    if (result.status === "totp_setup") {
      onSetup(result.secret);
    } else {
      onCode();
    }
  }

  return (
    <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
      <Field label="Логин">
        {(control) => (
          <Input
            {...control}
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        )}
      </Field>
      <Field label="Пароль">
        {(control) => (
          <Input
            {...control}
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        )}
      </Field>
      <FormError>{error}</FormError>
      <Button type="submit" disabled={pending || username.trim() === "" || password === ""}>
        {pending ? "Проверка…" : "Дальше"}
      </Button>
    </form>
  );
}
