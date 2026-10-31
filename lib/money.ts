/**
 * All money is stored and passed around as integer minor units (centavos).
 * Change CURRENCY (or set the env var) to switch the display currency.
 */
export const CURRENCY =
  process.env.NEXT_PUBLIC_CURRENCY || process.env.CURRENCY || "PHP";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const CURRENCY_SYMBOL =
  currencyFormatter
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value ?? CURRENCY;

export function formatCurrency(amountCents: number): string {
  return currencyFormatter.format(amountCents / 100);
}

/** Plain amount without the currency symbol, useful for compact chart labels. */
export function formatAmount(amountCents: number): string {
  return (amountCents / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Parses a user-entered amount ("1,234.5", "₱250") into integer centavos
 * without ever going through floating point arithmetic.
 * Returns null when the input is not a valid positive amount.
 */
export function parseAmountToCents(input: string): number | null {
  const cleaned = input
    .trim()
    .replace(/[₱,\s]/g, "")
    .replace(/^PHP/i, "");

  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;

  const [whole, fraction = ""] = cleaned.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));

  if (!Number.isSafeInteger(cents) || cents <= 0) return null;
  return cents;
}
