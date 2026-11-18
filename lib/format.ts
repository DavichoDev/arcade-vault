/** 28450 -> "28,450" (fixed en-US locale so server and client agree). */
export function formatScore(n: number): string {
  return n.toLocaleString("en-US");
}

/** "2026-03-07" -> "03/07/2026" (MM/DD/YYYY, no Date parsing/timezones). */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${month}/${day}/${year}`;
}
