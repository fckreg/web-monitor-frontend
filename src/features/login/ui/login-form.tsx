"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { routes } from "@/shared/config";

import { CodeStep } from "./code-step";
import { CredentialStep } from "./credential-step";
import { RecoveryStep } from "./recovery-step";
import { SetupStep } from "./setup-step";

type Step =
  | { kind: "credentials" }
  | { kind: "setup"; secret: string; qrSrc: string }
  | { kind: "code" }
  | { kind: "recovery"; codes: string[] };

const STEP_TITLE: Record<Step["kind"], string> = {
  credentials: "Логин и пароль",
  setup: "Подключение аутентификатора",
  code: "Код подтверждения",
  recovery: "Коды восстановления",
};

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ kind: "credentials" });
  const region = useRef<HTMLElement>(null);
  const focusedKind = useRef(step.kind);

  // Прежний шаг размонтирован вместе с фокусом: переносим фокус на новый шаг.
  useEffect(() => {
    if (focusedKind.current === step.kind) {
      return;
    }

    focusedKind.current = step.kind;
    region.current?.focus();
  }, [step.kind]);

  function enter() {
    router.replace(routes.targets);
    router.refresh();
  }

  let body = (
    <CredentialStep
      onSetup={(secret) =>
        setStep({
          kind: "setup",
          secret,
          qrSrc: `/api/auth/totp/qr?v=${crypto.randomUUID()}`,
        })
      }
      onCode={() => setStep({ kind: "code" })}
    />
  );

  if (step.kind === "setup") {
    body = (
      <SetupStep
        secret={step.secret}
        qrSrc={step.qrSrc}
        onConfirmed={(codes) => setStep({ kind: "recovery", codes })}
      />
    );
  } else if (step.kind === "code") {
    body = <CodeStep onSuccess={enter} />;
  } else if (step.kind === "recovery") {
    body = <RecoveryStep codes={step.codes} onContinue={enter} />;
  }

  return (
    <section ref={region} tabIndex={-1} aria-label={STEP_TITLE[step.kind]} className="outline-none">
      {body}
    </section>
  );
}
