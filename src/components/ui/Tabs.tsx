import { type KeyboardEvent, type ReactNode, useId, useRef } from "react";
import { cn } from "./cn";

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
}

/**
 * Accessible tab list (arrow keys, Home, End). The caller renders the panel and
 * labels it with `tabPanelProps(baseId, value)`.
 */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  idBase,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  idBase?: string;
  className?: string;
}) {
  const generated = useId();
  const base = idBase ?? generated;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((item) => item.id === value);
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    const item = items[next];
    if (!item) return;
    onChange(item.id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("inline-flex gap-1 rounded-xl border border-line bg-surface p-1", className)}
    >
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${base}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              "h-9 rounded-lg px-3 text-body font-medium transition-colors pointer-coarse:h-11",
              selected ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function tabPanelProps(base: string, id: string) {
  return {
    role: "tabpanel" as const,
    id: `${base}-panel-${id}`,
    "aria-labelledby": `${base}-tab-${id}`,
  };
}
