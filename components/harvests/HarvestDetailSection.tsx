import { notFound } from "next/navigation";
import { connection } from "next/server";
import { HarvestDetails } from "@/components/harvests/HarvestDetails";
import { HarvestHeader } from "@/components/harvests/HarvestHeader";
import { todayInputValue } from "@/lib/dates";
import { getCategoryBreakdown, getHarvestDetail } from "@/lib/queries";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/Icons";

export async function HarvestDetailSection({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const result = await getHarvestDetail(id);

  if (!result) notFound();

  const { harvest, categories } = result;
  const breakdown = getCategoryBreakdown(harvest.expenses, harvest.totalCents);
  const today = todayInputValue();

  return (
    <div className="space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
      >
        <ChevronRightIcon className="h-3.5 w-3.5 rotate-180" />
        All harvests
      </Link>

      <HarvestHeader harvest={harvest} />

      <HarvestDetails
        harvest={harvest}
        categories={categories}
        breakdown={breakdown}
        today={today}
      />
    </div>
  );
}
