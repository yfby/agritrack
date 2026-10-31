import Link from "next/link";
import { connection } from "next/server";
import { NewHarvestPanel } from "@/components/harvests/NewHarvestPanel";
import { StatusBadge } from "@/components/ui/Badges";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChevronRightIcon, SproutIcon } from "@/components/ui/Icons";
import { formatDateRange, todayInputValue } from "@/lib/dates";
import { formatCurrency } from "@/lib/money";
import { getHarvestSummaries } from "@/lib/queries";
import { cardClass } from "@/lib/ui";

export async function HarvestListSection() {
  await connection();
  const [harvests, today] = await Promise.all([
    getHarvestSummaries(),
    Promise.resolve(todayInputValue()),
  ]);

  return (
    <div className="space-y-4">
      <NewHarvestPanel today={today} />

      {harvests.length === 0 ? (
        <EmptyState
          icon={<SproutIcon />}
          title="No harvests yet"
          description="Create your first harvest to start recording seeds, labor, fuel, and every other cost."
        />
      ) : (
        <ul className="space-y-3">
          {harvests.map((harvest) => (
            <li key={harvest.id}>
              <Link
                href={`/harvests/${harvest.id}`}
                className={`${cardClass} group flex items-center gap-4 p-4 transition hover:border-emerald-300 hover:shadow-md sm:p-5`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-stone-900 group-hover:text-emerald-800">
                      {harvest.name}
                    </h3>
                    <StatusBadge status={harvest.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-stone-500">
                    {harvest.crop ? `${harvest.crop} · ` : ""}
                    {formatDateRange(harvest.startDate, harvest.endDate)}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-lg font-bold tabular-nums text-stone-900">
                      {formatCurrency(harvest.totalCents)}
                    </span>
                    <span className="text-sm text-stone-500">
                      · {harvest.expenseCount}{" "}
                      {harvest.expenseCount === 1 ? "expense" : "expenses"}
                    </span>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-stone-300 transition group-hover:text-emerald-700" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
