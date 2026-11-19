"use client";

import { type FormEvent, useState } from "react";

import { Button, Field, FormError, Input } from "@/shared/ui";

import { groupNameSchema } from "../model/schema";

export function GroupNameForm({
  initial = "",
  submitLabel,
  pending,
  error,
  onSubmit,
}: {
  initial?: string;
  submitLabel: string;
  pending: boolean;
  error: string | null;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initial);
  const [fieldError, setFieldError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = groupNameSchema.safeParse({ name });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Укажите название");

      return;
    }

    setFieldError(null);
    onSubmit(parsed.data.name);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <Field label="Название" error={fieldError}>
        {(control) => (
          <Input
            {...control}
            value={name}
            maxLength={200}
            onChange={(event) => setName(event.target.value)}
          />
        )}
      </Field>
      <FormError>{error}</FormError>
      <Button type="submit" disabled={pending}>
        {pending ? "Сохранение…" : submitLabel}
      </Button>
    </form>
  );
}
