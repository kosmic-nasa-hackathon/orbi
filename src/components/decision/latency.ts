export function formatLatency(seconds: number): string {
  if (seconds === 0) return "live link";
  if (seconds < 60) return `${seconds} s one-way`;
  return `${Math.round(seconds / 60)} min one-way`;
}
