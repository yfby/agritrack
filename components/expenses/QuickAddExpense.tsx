"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createExpense } from "@/app/actions/expenses";
import { ExpenseFormFields } from "@/components/expenses/ExpenseFormFields";
import { FormMessage } from "@/components/ui/FormMessage";
import { PlusIcon } from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { initialActionState } from "@/lib/action-state";
import type { CategoryOption } from "@/lib/queries";
import { cardClass } from "@/lib/ui";

export function QuickAddExpense({
  harvestId,
  categories,
  today,
}: {
  harvestId: string;
  categories: CategoryOption[];
  today: string;
}) {
  const [state, formAction] = useActionState(createExpense, initialActionState);

  return (
    <section className={`${cardClass} p-4 sm:p-5`}>
      <div>
        <h2 className="text-base font-semibold text-stone-900">Add expense</h2>
        <p className="mt-0.5 text-sm text-stone-500">
          Log a cost against this harvest.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          No categories exist yet.{" "}
          <Link href="/categories" className="font-semibold underline">
            Add a category
          </Link>{" "}
          before logging an expense.
        </div>
      ) : (
        <>
          <div className="mt-3">
            <FormMessage state={state} />
          </div>
          <form
            key={state.token ?? "quick-add"}
            action={formAction}
            className="mt-4 space-y-3 border-t border-stone-100 pt-4"
          >
            <input type="hidden" name="harvestId" value={harvestId} />
            <ExpenseFormFields
              idPrefix="quick-expense"
              values={{
                amount: "",
                categoryId: categories[0]?.id ?? "",
                date: today,
                description: "",
              }}
              categories={categories}
              errors={state.fieldErrors}
            />
            <SubmitButton pendingText="Adding…" className="w-full">
              <PlusIcon /> Add expense
            </SubmitButton>
          </form>
        </>
      )}
    </section>
  );
}
