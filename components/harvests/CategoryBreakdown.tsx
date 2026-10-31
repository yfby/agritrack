import { formatCurrency } from "@/lib/money";
import type { CategoryBreakdownRow } from "@/lib/queries";
import { cardClass } from "@/lib/ui";

export function CategoryBreakdown({
  rows,
  totalCents,
}: {
  rows: CategoryBreakdownRow[];
  totalCents: number;
}) {
  return (
    <section className={`${cardClass} p-4 sm:p-5`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-stone-900">
          Spending by category
        </h2>
        <span className="shrink-0 text-xs font-medium text-stone-400">
          {rows.length} {rows.length === 1 ? "category" : "categories"}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-stone-200 px-3 py-6 text-center text-sm text-stone-500">
          No spending to break down yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {rows.map((row) => (
            <li key={row.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                    aria-hidden
                  />
                  <span className="truncate font-medium text-stone-800">
                    {row.name}
                  </span>
                  <span className="shrink-0 text-xs text-stone-400">
                    · {row.count}
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-stone-900">
                  {row.totalLabel}
                  <span className="ml-1.5 text-xs font-medium text-stone-400">
                    {row.percent}%
                  </span>
                </span>
              </div>
              <div
                className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100"
                role="progressbar"
                aria-label={`${row.name} share of spending`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={row.percent}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${row.percent}%`,
                    minWidth: row.percent > 0 ? "2px" : 0,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-baseline justify-between border-t border-stone-100 pt-3 text-sm">
        <span className="font-semibold text-stone-700">Total</span>
        <span className="font-bold tabular-nums text-stone-900">
          {formatCurrency(totalCents)}
        </span>
      </div>
    </section>
  );
}
