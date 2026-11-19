"use client";

import { useState } from "react";

import type { GroupRef } from "@/entities/group";
import {
  type Target,
  TargetForm,
  type TargetFormValues,
  toTargetFormValues,
} from "@/entities/target";
import { useApiAction } from "@/shared/api";
import { Button, Dialog } from "@/shared/ui";

export function EditTargetButton({ target, groups }: { target: Target; groups: GroupRef[] }) {
  const [open, setOpen] = useState(false);
  const { run, pending, error, setError } = useApiAction();

  async function save(values: TargetFormValues) {
    if (await run(`/targets/${target.id}`, "PATCH", values)) {
      setOpen(false);
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Изменить
      </Button>
      <Dialog
        open={open}
        title={`Редактирование: ${target.name}`}
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
      >
        <TargetForm
          initial={toTargetFormValues(target)}
          groups={groups}
          submitLabel="Сохранить"
          pending={pending}
          error={error}
          onSubmit={(values) => void save(values)}
        />
      </Dialog>
    </>
  );
}
