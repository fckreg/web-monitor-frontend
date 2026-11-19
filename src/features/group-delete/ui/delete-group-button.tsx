"use client";

import { useState } from "react";

import { useApiAction } from "@/shared/api";
import { Button, Dialog, FormError } from "@/shared/ui";

export function DeleteGroupButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const { run, pending, error, setError } = useApiAction();

  async function remove() {
    if (await run(`/groups/${id}`, "DELETE")) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Удалить группу
      </Button>
      <Dialog
        open={open}
        title="Удалить группу"
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Группа «{name}» будет удалена. Сайты из неё нужно перенести или удалить заранее.
          </p>
          <FormError>{error}</FormError>
          <Button variant="danger" disabled={pending} onClick={() => void remove()}>
            {pending ? "Удаление…" : "Удалить"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
