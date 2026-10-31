import { HarvestActions } from "@/components/harvests/HarvestActions";
import { StatusBadge } from "@/components/ui/Badges";
import { formatDate, formatDateRange, toDateInput } from "@/lib/dates";
import { formatCurrency } from "@/lib/money";
import type { HarvestDetailData } from "@/lib/queries";
import { cardClass } from "@/lib/ui";

export function HarvestHeader({ harvest }: { harvest: HarvestDetailData }) {
  return (
    <section className={`${cardClass} p-4 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              {harvest.name}
            </h1>
            <StatusBadge status={harvest.status} />
          </div>
          <p className="mt-1 text-sm text-stone-500">
            {harvest.crop ? `${harvest.crop} · ` : ""}
            {formatDateRange(harvest.startDate, harvest.endDate)}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-right ring-1 ring-emerald-100">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            Total spent
          </p>
          <p className="text-xl font-bold tabular-nums text-emerald-900 sm:text-2xl">
            {formatCurrency(harvest.totalCents)}
          </p>
        </div>
      </div>

      {harvest.notes ? (
        <p className="mt-4 whitespace-pre-line rounded-lg bg-stone-50 px-3 py-2.5 text-sm text-stone-600">
          {harvest.notes}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
        <span>
          <strong className="font-semibold text-stone-800">
            {harvest.expenses.length}
          </strong>{" "}
          {harvest.expenses.length === 1 ? "expense" : "expenses"}
        </span>
        <span>Started {formatDate(harvest.startDate)}</span>
        {harvest.endDate ? (
          <span>Ended {formatDate(harvest.endDate)}</span>
        ) : (
          <span className="text-stone-400">No end date</span>
        )}
      </div>

      <HarvestActions
        harvestId={harvest.id}
        harvestName={harvest.name}
        expenseCount={harvest.expenses.length}
        status={harvest.status}
        values={{
          name: harvest.name,
          crop: harvest.crop ?? "",
          startDate: toDateInput(harvest.startDate),
          endDate: harvest.endDate ? toDateInput(harvest.endDate) : "",
          notes: harvest.notes ?? "",
        }}
      />
    </section>
  );
}
