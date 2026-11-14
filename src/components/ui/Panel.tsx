import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

/** Section container for a screen: optional kicker, title and trailing actions. */
export function Panel({
  kicker,
  title,
  actions,
  className,
  children,
  ...rest
}: Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  kicker?: string;
  title?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section
      className={cn("rounded-3xl border border-line bg-surface p-5 sm:p-6", className)}
      {...rest}
    >
      {(kicker || title || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {kicker && (
              <p className="font-mono text-label font-medium text-faint uppercase">{kicker}</p>
            )}
            {title && <h2 className="mt-1 font-display text-title font-semibold">{title}</h2>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
