"use client";

import { useActionState, useState } from "react";
import { deleteExpense, updateExpense } from "@/app/actions/expenses";
import { ExpenseFormFields } from "@/components/expenses/ExpenseFormFields";
import { CategoryBadge } from "@/components/ui/Badges";
import { FormMessage } from "@/components/ui/FormMessage";
import { PencilIcon, TrashIcon } from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { initialActionState } from "@/lib/action-state";
import type { CategoryOption, ExpenseView } from "@/lib/queries";
import {
  dangerButtonClass,
  ghostButtonClass,
  secondaryButtonClass,
} from "@/lib/ui";

export function ExpenseRow({
  expense,
  categories,
  isClosed,
}: {
  expense: ExpenseView;
  categories: CategoryOption[];
  isClosed: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [editState, editAction] = useActionState(
    updateExpense,
    initialActionState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteExpense,
    initialActionState,
  );

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:grid md:grid-cols-[6.5rem_10.5rem_minmax(0,1fr)_7rem_7rem] md:items-center md:gap-3">
        <span className="text-xs text-stone-500 md:text-sm">
          {expense.dateLabel}
        </span>
        <div className="min-w-0">
          <CategoryBadge
            name={expense.category.name}
            color={expense.category.color}
          />
        </div>
        <span className="ml-auto text-sm font-bold tabular-nums text-stone-900 md:hidden">
          {expense.amountLabel}
        </span>
        <p className="w-full text-sm text-stone-600 md:w-auto md:truncate">
          {expense.description || (
            <span className="text-stone-400">No description</span>
          )}
        </p>
        <span className="hidden text-right text-sm font-bold tabular-nums text-stone-900 md:block">
          {expense.amountLabel}
        </span>
        {isClosed ? (
          <span className="w-full text-right text-xs text-stone-400 md:w-auto">
            Read-only
          </span>
        ) : (
          <div className="flex w-full items-center justify-end gap-1 md:w-auto">
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setEditing((value) => !value);
              }}
              className={ghostButtonClass}
              aria-expanded={editing}
            >
              <PencilIcon /> Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setConfirming(true);
              }}
              className={dangerButtonClass}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <form
          key={`${expense.amountCents}-${expense.category.id}-${expense.dateISO}-${
            expense.description ?? ""
          }`}
          action={editAction}
          className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:p-4"
        >
          <input type="hidden" name="id" value={expense.id} />
          {editState.status !== "idle" ? (
            <div className="mb-3">
              <FormMessage state={editState} />
            </div>
          ) : null}
          <ExpenseFormFields
            idPrefix={`edit-expense-${expense.id}`}
            values={{
              amount: (expense.amountCents / 100).toFixed(2),
              categoryId: expense.category.id,
              date: expense.dateISO,
              description: expense.description ?? "",
            }}
            categories={categories}
            errors={editState.fieldErrors}
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
          </div>
        </form>
      ) : null}

      {confirming ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-900">
            Delete this {expense.amountLabel} expense? This cannot be undone.
          </p>
          <FormMessage state={deleteState} />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={expense.id} />
              <SubmitButton
                variant="danger"
                pendingText="Deleting…"
                className="px-3 py-2"
              >
                <TrashIcon /> Yes, delete
              </SubmitButton>
            </form>
          </div>
        </div>
      ) : null}
    </li>
  );
}
