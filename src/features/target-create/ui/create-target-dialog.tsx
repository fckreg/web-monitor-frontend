"use client";

import { useState } from "react";

import type { GroupRef } from "@/entities/group";
import { emptyTargetForm, TargetForm, type TargetFormValues } from "@/entities/target";
import { useApiAction } from "@/shared/api";
import { Button, Dialog } from "@/shared/ui";

export function CreateTargetDialog({ groups }: { groups: GroupRef[] }) {
  const [open, setOpen] = useState(false);
  const { run, pending, error, setError } = useApiAction();

  async function create(values: TargetFormValues) {
    if (await run("/targets", "POST", values)) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Добавить цель</Button>
      <Dialog
        open={open}
        title="Новая цель"
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
      >
        <TargetForm
          initial={emptyTargetForm}
          groups={groups}
          submitLabel="Создать"
          pending={pending}
          error={error}
          onSubmit={(values) => void create(values)}
        />
      </Dialog>
    </>
  );
}
