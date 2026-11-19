"use client";

import { type FormEvent, useState } from "react";

import type { GroupRef } from "@/entities/group/@x/target";
import { Button, Field, FormError, Input, Select } from "@/shared/ui";

import { targetFormSchema } from "../model/schema";
import type { TargetFormValues } from "../model/types";

type FieldErrors = Partial<Record<keyof TargetFormValues, string>>;

function collectErrors(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of issues) {
    const key = issue.path[0] as keyof TargetFormValues | undefined;

    if (key && errors[key] === undefined) {
      errors[key] = issue.message;
    }
  }

  return errors;
}

export function TargetForm({
  initial,
  groups,
  submitLabel,
  pending,
  error,
  onSubmit,
}: {
  initial: TargetFormValues;
  groups: GroupRef[];
  submitLabel: string;
  pending: boolean;
  error: string | null;
  onSubmit: (values: TargetFormValues) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [url, setUrl] = useState(initial.url);
  const [intervalSeconds, setIntervalSeconds] = useState(String(initial.interval_seconds));
  const [expectedStatus, setExpectedStatus] = useState(
    initial.expected_status === null ? "" : String(initial.expected_status),
  );
  const [enabled, setEnabled] = useState(initial.enabled);
  const [isPublic, setIsPublic] = useState(initial.is_public);
  const [groupId, setGroupId] = useState(initial.group_id);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = targetFormSchema.safeParse({
      name,
      url,
      interval_seconds: Number(intervalSeconds),
      expected_status: expectedStatus.trim() === "" ? null : Number(expectedStatus),
      enabled,
      is_public: isPublic,
      group_id: groupId,
    });

    if (!parsed.success) {
      setFieldErrors(collectErrors(parsed.error.issues));

      return;
    }

    setFieldErrors({});
    onSubmit(parsed.data);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <Field label="Группа" error={fieldErrors.group_id}>
        {(control) => (
          <Select
            {...control}
            value={groupId ?? ""}
            onChange={(event) => setGroupId(event.target.value === "" ? null : event.target.value)}
          >
            <option value="">Без группы</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Имя" error={fieldErrors.name}>
        {(control) => (
          <Input {...control} value={name} onChange={(event) => setName(event.target.value)} />
        )}
      </Field>
      <Field label="URL" error={fieldErrors.url}>
        {(control) => (
          <Input
            {...control}
            type="url"
            inputMode="url"
            value={url}
            placeholder="https://example.com"
            onChange={(event) => setUrl(event.target.value)}
          />
        )}
      </Field>
      <Field label="Интервал, секунды" error={fieldErrors.interval_seconds}>
        {(control) => (
          <Input
            {...control}
            inputMode="numeric"
            value={intervalSeconds}
            onChange={(event) => setIntervalSeconds(event.target.value)}
          />
        )}
      </Field>
      <Field
        label="Ожидаемый статус"
        hint="Пусто — подойдёт любой код 2xx"
        error={fieldErrors.expected_status}
      >
        {(control) => (
          <Input
            {...control}
            inputMode="numeric"
            value={expectedStatus}
            onChange={(event) => setExpectedStatus(event.target.value)}
          />
        )}
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        Включена
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) => setIsPublic(event.target.checked)}
        />
        Показывать на главной
      </label>
      <FormError>{error}</FormError>
      <Button type="submit" disabled={pending}>
        {pending ? "Сохранение…" : submitLabel}
      </Button>
    </form>
  );
}
