"use client";

import { useFormStatus } from "react-dom";
import {
  dangerButtonClass,
  ghostButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/lib/ui";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary: primaryButtonClass,
  secondary: secondaryButtonClass,
  ghost: ghostButtonClass,
  danger: dangerButtonClass,
};

export function SubmitButton({
  children,
  pendingText,
  variant = "primary",
  className = "",
  title,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: Variant;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={title}
      className={`${variantClasses[variant]} ${className}`}
    >
      {pending ? (pendingText ?? "Saving…") : children}
    </button>
  );
}
