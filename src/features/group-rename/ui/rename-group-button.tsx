"use client";

import { useState } from "react";

import { GroupNameForm } from "@/entities/group";
import { useApiAction } from "@/shared/api";
import { Button, Dialog } from "@/shared/ui";

export function RenameGroupButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const { run, pending, error, setError } = useApiAction();

  async function rename(next: string) {
    if (await run(`/groups/${id}`, "PATCH", { name: next })) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Переименовать
      </Button>
      <Dialog
        open={open}
        title="Название группы"
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
      >
        <GroupNameForm
          initial={name}
          submitLabel="Сохранить"
          pending={pending}
          error={error}
          onSubmit={(next) => void rename(next)}
        />
      </Dialog>
    </>
  );
}
