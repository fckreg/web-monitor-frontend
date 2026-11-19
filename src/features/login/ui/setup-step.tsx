"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";

import { useApiAction } from "@/shared/api";
import { Button, CodeList, Field, FormError, Input } from "@/shared/ui";

import { sessionResultSchema } from "../model/schema";

export function SetupStep({
  secret,
  qrSrc,
  onConfirmed,
}: {
  secret: string;
  qrSrc: string;
  onConfirmed: (codes: string[]) => void;
}) {
  const [code, setCode] = useState("");
  const { runJson, pending, error } = useApiAction();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const session = await runJson("/auth/totp/confirm", "POST", { code }, sessionResultSchema, {
      refresh: false,
    });

    if (session) {
      onConfirmed(session.recovery_codes);
    }
  }

  return (
    <form className="space-y-4" onSubmit={(event) => void onSubmit(event)}>
      <p className="text-sm text-muted">
        Отсканируйте код в приложении-аутентификаторе. Если сканера нет, введите ключ вручную. Не
        обновляйте страницу, пока не подтвердите код.
      </p>
      <Image
        src={qrSrc}
        alt="QR-код для приложения-аутентификатора"
        width={176}
        height={176}
        unoptimized
        className="h-44 w-44 rounded-control border border-line bg-white p-2"
      />
      <CodeList codes={[secret]} copyLabel="Скопировать ключ" />
      <Field label="Код из приложения">
        {(control) => (
          <Input
            {...control}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          />
        )}
      </Field>
      <FormError>{error}</FormError>
      <Button type="submit" disabled={pending || code.length !== 6}>
        {pending ? "Проверка…" : "Подтвердить"}
      </Button>
    </form>
  );
}
