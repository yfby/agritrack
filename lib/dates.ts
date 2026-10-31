const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * Dates are date-only values, stored at midnight UTC so they render the same
 * regardless of the server/browser timezone.
 */
export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;

  // Reject overflowed dates such as 2026-02-30.
  if (date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

export function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatShortDate(date: Date): string {
  return shortDateFormatter.format(date);
}

export function formatDateRange(start: Date, end: Date | null): string {
  if (!end) return `${formatDate(start)} – ongoing`;
  if (toDateInput(start) === toDateInput(end)) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** Today's date in the server's local timezone, as YYYY-MM-DD. */
export function todayInputValue(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
