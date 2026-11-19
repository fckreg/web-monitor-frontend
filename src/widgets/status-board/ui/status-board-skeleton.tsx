const PLACEHOLDERS = ["a", "b", "c", "d", "e", "f"];

export function StatusBoardSkeleton() {
  return (
    <div className="mt-10">
      <p role="status" className="sr-only">
        Загружаем проверки…
      </p>
      <div aria-hidden className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDERS.map((key) => (
          <div key={key} className="surface-card h-28 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
