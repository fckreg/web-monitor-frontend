"use client";

import { useApiAction } from "@/shared/api";

export function TargetToggle({
  id,
  checked,
  field,
  label,
}: {
  id: string;
  checked: boolean;
  field: "enabled" | "is_public";
  label: string;
}) {
  const { run, pending, error } = useApiAction();

  return (
    <div className="text-sm">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          disabled={pending}
          onChange={(event) =>
            void run(`/targets/${id}`, "PATCH", {
              [field]: event.target.checked,
            })
          }
        />
        {label}
      </label>
      {error ? (
        <p role="alert" className="mt-1 text-xs text-down">
          {error}
        </p>
      ) : null}
    </div>
  );
}
