import { Suspense } from "react";
import { HarvestDetailSection } from "@/components/harvests/HarvestDetailSection";
import { PageSkeleton } from "@/components/ui/Skeletons";

export const metadata = { title: "Harvest" };

export default function HarvestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton title="harvest" />}>
      <HarvestDetailSection params={params} />
    </Suspense>
  );
}
