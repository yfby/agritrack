import { connection } from "next/server";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { getCategoriesWithCounts } from "@/lib/queries";

export async function CategoriesSection() {
  await connection();
  const categories = await getCategoriesWithCounts();

  return <CategoryManager categories={categories} />;
}
