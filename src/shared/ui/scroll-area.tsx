"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib";

export function ScrollArea({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const measure = () => {
      setOverflow(
        node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(className)}
      tabIndex={overflow ? 0 : undefined}
      aria-label={label}
    >
      {children}
    </section>
  );
}
