import { cn } from "@/shared/lib";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-xl bg-canvas",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <rect x="5.5" y="6.5" width="3.2" height="11" rx="1.6" fill="var(--color-up-mark)" />
        <rect x="10.4" y="6.5" width="3.2" height="11" rx="1.6" fill="var(--color-up-mark)" />
        <rect x="15.3" y="6.5" width="3.2" height="11" rx="1.6" fill="var(--color-down-mark)" />
      </svg>
    </span>
  );
}
