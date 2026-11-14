import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Fades and lifts its content in on mount. With reduced motion it only fades. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.5, delay: reduce ? 0 : delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
