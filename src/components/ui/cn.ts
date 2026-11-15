import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge does not know the design-system font sizes from src/index.css, so it would read
 * `text-body` as a colour and drop it next to `text-ink` (#75). Registering them keeps both.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["label", "caption", "body", "lead", "title", "headline", "display"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
