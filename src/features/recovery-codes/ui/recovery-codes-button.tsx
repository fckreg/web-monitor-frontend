"use client";

import { type FormEvent, useState } from "react";

import { useApiAction } from "@/shared/api";
import { Button, CodeList, Dialog, Field, FormError, Input } from "@/shared/ui";

import { recoveryCodesSchema } from "../model/schema";

export function RecoveryCodesButton() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[] | null>(null);
  const { runJson, pending, error, setError } = useApiAction();

  function close() {
    setOpen(false);
    setCode("");
    setCodes(null);
    setError(null);
  }

  async function issue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issued = await runJson("/auth/recovery-codes", "POST", { code }, recoveryCodesSchema, {
      refresh: false,
    });

    if (!issued) {
      return;
    }

    setCodes(issued.recovery_codes);
    setCode("");
  }

  return (
    <>
      <Button
        variant="ghost"
        className="border-panel-button-line bg-panel-button text-on-panel hover:bg-panel-button-hover"
        onClick={() => setOpen(true)}
      >
        Коды
      </Button>
      <Dialog open={open} title="Коды восстановления" onClose={close}>
        {codes ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Прежние коды больше не действуют. Сохраните новые: окно покажет их один раз.
            </p>
            <CodeList codes={codes} />
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(event) => void issue(event)}>
            <p className="text-sm text-muted">
              Введите текущий код из приложения-аутентификатора. Будут выданы новые одноразовые
              коды.
            </p>
            <Field label="Код">
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
              {pending ? "Проверка…" : "Выпустить коды"}
            </Button>
          </form>
        )}
      </Dialog>
    </>
  );
}
