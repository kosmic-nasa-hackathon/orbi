import { Moon, Sun } from "lucide-react";
import { cn } from "../components/ui/cn";
import { useTheme } from "./useTheme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 pointer-coarse:h-11 text-body font-medium text-muted transition-colors hover:bg-surface-strong hover:text-ink",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden lg:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
