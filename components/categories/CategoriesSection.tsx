import { connection } from "next/server";
import { requireAuth } from "@/lib/auth";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { getCategoriesWithCounts } from "@/lib/queries";

export async function CategoriesSection() {
  await connection();
  await requireAuth();
  const categories = await getCategoriesWithCounts();

  return <CategoryManager categories={categories} />;
}
