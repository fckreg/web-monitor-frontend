"use client";

import { useState } from "react";

import { GroupNameForm } from "@/entities/group";
import { useApiAction } from "@/shared/api";
import { Button, Dialog } from "@/shared/ui";

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const { run, pending, error, setError } = useApiAction();

  async function create(name: string) {
    if (await run("/groups", "POST", { name })) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Новая группа
      </Button>
      <Dialog
        open={open}
        title="Новая группа"
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
      >
        <GroupNameForm
          submitLabel="Создать"
          pending={pending}
          error={error}
          onSubmit={(name) => void create(name)}
        />
      </Dialog>
    </>
  );
}
