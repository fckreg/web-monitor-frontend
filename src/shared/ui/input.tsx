import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib";

const control =
  "w-full rounded-control border border-line bg-paper px-3 py-2 text-sm aria-invalid:border-down";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, className)} {...props} />;
}
