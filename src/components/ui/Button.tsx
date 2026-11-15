import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:opacity-90",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-surface-strong",
  ghost: "text-muted hover:bg-surface-strong hover:text-ink",
};

// md and lg keep a 44 px touch target; sm grows to 44 px on touch (coarse) pointers.
const SIZE_CLASS: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-caption pointer-coarse:h-11",
  md: "h-11 gap-2 px-4 text-body",
  lg: "h-12 gap-2 px-5 text-lead",
};

export function Button({
  variant = "secondary",
  size = "md",
  type = "button",
  className,
  ...rest
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    />
  );
}
