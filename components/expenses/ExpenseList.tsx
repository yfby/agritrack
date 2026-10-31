"use client";

import { useMemo, useState } from "react";
import { ExpenseRow } from "@/components/expenses/ExpenseRow";
import { ExpenseIcon } from "@/components/ui/Icons";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CategoryOption, ExpenseView } from "@/lib/queries";
import { cardClass } from "@/lib/ui";

type SortOrder = "date-desc" | "date-asc";
const ALL = "ALL";

export function ExpenseList({
  expenses,
  categories,
  isClosed,
}: {
  expenses: ExpenseView[];
  categories: CategoryOption[];
  isClosed: boolean;
}) {
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [sortOrder, setSortOrder] = useState<SortOrder>("date-desc");

  const usedCategories = useMemo(
    () =>
      categories.filter((category) =>
        expenses.some((expense) => expense.category.id === category.id),
      ),
    [categories, expenses],
  );

  const visibleExpenses = useMemo(() => {
    const filtered =
      categoryFilter === ALL
        ? expenses
        : expenses.filter(
            (expense) => expense.category.id === categoryFilter,
          );

    return filtered.toSorted((a, b) => {
      const byDate = a.dateISO.localeCompare(b.dateISO);
      return sortOrder === "date-asc" ? byDate : -byDate;
    });
  }, [expenses, categoryFilter, sortOrder]);

  return (
    <section className={`${cardClass} overflow-hidden`}>
      <div className="flex flex-col gap-3 border-b border-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="text-base font-semibold text-stone-900">Expenses</h2>
          <p className="mt-0.5 text-sm text-stone-500">
            {visibleExpenses.length} of {expenses.length}{" "}
            {expenses.length === 1 ? "expense" : "expenses"}
          </p>
        </div>

        {expenses.length > 0 ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div>
              <label htmlFor="expense-filter" className="sr-only">
                Filter by category
              </label>
              <select
                id="expense-filter"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 sm:w-auto"
              >
                <option value={ALL}>All categories</option>
                {usedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="expense-sort" className="sr-only">
                Sort by date
              </label>
              <select
                id="expense-sort"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 sm:w-auto"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      {expenses.length === 0 ? (
        <div className="p-4 sm:p-5">
          <EmptyState
            icon={<ExpenseIcon />}
            title="No expenses yet"
            description={
              isClosed
                ? "This harvest was closed without any recorded expenses."
                : "Add your first expense using the form above. Every category total updates automatically."
            }
          />
        </div>
      ) : visibleExpenses.length === 0 ? (
        <div className="p-4 sm:p-5">
          <EmptyState
            title="No expenses in this category"
            description="Try a different category or clear the filter to see everything."
            action={
              <button
                type="button"
                onClick={() => setCategoryFilter(ALL)}
                className="text-sm font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
              >
                Clear filter
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="hidden border-b border-stone-100 bg-stone-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-stone-500 md:grid md:grid-cols-[6.5rem_10.5rem_minmax(0,1fr)_7rem_7rem] md:gap-3 sm:px-5">
            <span>Date</span>
            <span>Category</span>
            <span>Description</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-stone-100 px-4 sm:px-5">
            {visibleExpenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                categories={categories}
                isClosed={isClosed}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
