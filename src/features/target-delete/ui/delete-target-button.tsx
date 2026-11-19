"use client";

import { useState } from "react";

import { useApiAction } from "@/shared/api";
import { Button, Dialog, FormError } from "@/shared/ui";

export function DeleteTargetButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const { run, pending, error, setError } = useApiAction();

  async function remove() {
    if (await run(`/targets/${id}`, "DELETE")) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Удалить
      </Button>
      <Dialog
        open={open}
        title="Удалить цель"
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">Цель «{name}» и её история проверок будут удалены.</p>
          <FormError>{error}</FormError>
          <Button variant="danger" disabled={pending} onClick={() => void remove()}>
            {pending ? "Удаление…" : "Удалить"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
