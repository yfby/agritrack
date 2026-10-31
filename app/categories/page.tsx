import { Suspense } from "react";
import { CategoriesSection } from "@/components/categories/CategoriesSection";
import { PageSkeleton } from "@/components/ui/Skeletons";

export const metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
          Settings
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          Categories
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Group expenses so every harvest total tells you where the money went.
        </p>
      </header>

      <Suspense fallback={<PageSkeleton title="categories" />}>
        <CategoriesSection />
      </Suspense>
    </div>
  );
}
