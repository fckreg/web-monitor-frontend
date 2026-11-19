import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-control px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-accent text-on-accent hover:bg-accent-hover",
        variant === "ghost" && "border border-line bg-paper text-ink hover:bg-canvas",
        variant === "danger" && "bg-down text-on-accent hover:bg-down-hover",
        className,
      )}
      {...props}
    />
  );
}
