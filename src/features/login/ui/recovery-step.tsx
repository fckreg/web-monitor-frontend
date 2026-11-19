"use client";

import { Button, CodeList } from "@/shared/ui";

export function RecoveryStep({ codes, onContinue }: { codes: string[]; onContinue: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Сохраните коды восстановления. Они показываются один раз: каждым можно войти, если нет
        доступа к приложению-аутентификатору.
      </p>
      <CodeList codes={codes} />
      <Button type="button" onClick={onContinue}>
        Я сохранил коды
      </Button>
    </div>
  );
}
