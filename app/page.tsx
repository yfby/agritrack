import { Suspense } from "react";
import { HarvestListSection } from "@/components/harvests/HarvestListSection";
import { HarvestListSkeleton } from "@/components/ui/Skeletons";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          Farm costs
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Harvests
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Every season, every expense — in one place.
        </p>
      </header>

      <Suspense fallback={<HarvestListSkeleton />}>
        <HarvestListSection />
      </Suspense>
    </div>
  );
}
