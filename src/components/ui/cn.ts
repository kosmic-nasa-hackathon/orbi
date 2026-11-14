import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge, twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const twMergeSized = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["label", "caption", "body", "lead", "title", "headline", "display"] }],
    },
  },
});

/**
 * Like cn(), but knows the design-system font sizes from src/index.css, so a size and a text
 * colour can sit together. TODO(#75): make this the only cn() once nav and badge sizes are reviewed.
 */
export function cnSized(...inputs: ClassValue[]): string {
  return twMergeSized(clsx(inputs));
}
