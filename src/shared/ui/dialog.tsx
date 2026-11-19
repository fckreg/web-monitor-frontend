"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";

// Нативный modal-диалог сам держит фокус внутри, делает фон inert и возвращает фокус после закрытия.
export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (open && !node.open) {
      node.showModal();
    }

    if (!open && node.open) {
      node.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      className="surface-card m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto p-6 text-ink shadow-overlay backdrop:bg-scrim"
    >
      {open ? (
        <>
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            <button
              type="button"
              className="rounded-note px-2 py-1 text-sm text-muted hover:bg-canvas hover:text-ink"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
          {children}
        </>
      ) : null}
    </dialog>
  );
}
