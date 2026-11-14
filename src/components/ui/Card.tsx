import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

/** Smaller block inside a Panel. Pass `interactive` when the whole card is clickable. */
export function Card({
  interactive = false,
  className,
  ...rest
}: ComponentPropsWithoutRef<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface-strong p-4",
        interactive && "orbi-lift cursor-pointer hover:border-line-strong",
        className,
      )}
      {...rest}
    />
  );
}
