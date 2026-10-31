import { CategoryBreakdown } from "@/components/harvests/CategoryBreakdown";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { QuickAddExpense } from "@/components/expenses/QuickAddExpense";
import type { CategoryOption, HarvestDetailData } from "@/lib/queries";
import type { CategoryBreakdownRow } from "@/lib/queries";

export function HarvestDetails({
  harvest,
  categories,
  breakdown,
  today,
}: {
  harvest: HarvestDetailData;
  categories: CategoryOption[];
  breakdown: CategoryBreakdownRow[];
  today: string;
}) {
  const isClosed = harvest.status === "CLOSED";

  return (
    <div className="space-y-5">
      {isClosed ? (
        <div className="rounded-xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-700">
          <strong className="font-semibold">This harvest is closed.</strong>{" "}
          Expenses are read-only until you reopen it.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {isClosed ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-stone-900">Spending</h2>
            <p className="mt-2 text-sm text-stone-500">
              Reopen this harvest to add or change expenses. Totals and the
              category breakdown stay available while it is closed.
            </p>
          </section>
        ) : (
          <QuickAddExpense
            harvestId={harvest.id}
            categories={categories}
            today={today}
          />
        )}

        <CategoryBreakdown rows={breakdown} totalCents={harvest.totalCents} />
      </div>

      <ExpenseList
        expenses={harvest.expenses}
        categories={categories}
        isClosed={isClosed}
      />
    </div>
  );
}
