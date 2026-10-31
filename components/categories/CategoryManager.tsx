"use client";

import { useActionState, useState } from "react";
import { createCategory, deleteCategory, updateCategory } from "@/app/actions/categories";
import { ColorField } from "@/components/categories/ColorField";
import { EmptyState } from "@/components/ui/EmptyState";
import { FieldError, FormMessage } from "@/components/ui/FormMessage";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { initialActionState } from "@/lib/action-state";
import type { CategoryWithCount } from "@/lib/queries";
import {
  cardClass,
  dangerButtonClass,
  ghostButtonClass,
  inputClass,
  labelClass,
  secondaryButtonClass,
} from "@/lib/ui";

export function CategoryManager({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const [createState, createAction] = useActionState(
    createCategory,
    initialActionState,
  );

  return (
    <div className="space-y-6">
      <form
        key={createState.token ?? "create-category"}
        action={createAction}
        className={`${cardClass} space-y-4 p-4 sm:p-5`}
      >
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            Add a category
          </h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Categories are shared across all harvests.
          </p>
        </div>

        <FormMessage state={createState} />

        <div className="grid gap-4 sm:grid-cols-[1fr_220px_auto] sm:items-end">
          <div>
            <label htmlFor="new-category-name" className={labelClass}>
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="new-category-name"
              name="name"
              type="text"
              required
              maxLength={60}
              placeholder="e.g. Soil testing"
              className={inputClass}
              autoComplete="off"
            />
            <FieldError message={createState.fieldErrors?.name} />
          </div>

          <ColorField
            idPrefix="new-category"
            defaultValue="#16a34a"
            error={createState.fieldErrors?.color}
          />

          <SubmitButton pendingText="Adding…" className="w-full sm:w-auto">
            <PlusIcon /> Add category
          </SubmitButton>
        </div>
      </form>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Add a category above to start grouping your expenses."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryRow({ category }: { category: CategoryWithCount }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [editState, editAction] = useActionState(
    updateCategory,
    initialActionState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteCategory,
    initialActionState,
  );

  return (
    <li className={`${cardClass} p-4`}>
      <div className="flex items-start gap-3">
        <span
          className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-stone-100"
          style={{ backgroundColor: category.color }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-stone-900">
            {category.name}
          </h3>
          <p className="mt-0.5 text-xs text-stone-500">
            {category.expenseCount === 0
              ? "Not used yet"
              : `Used by ${category.expenseCount} ${
                  category.expenseCount === 1 ? "expense" : "expenses"
                }`}
          </p>
        </div>

        {!editing && !confirming ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={ghostButtonClass}
              aria-label={`Edit ${category.name}`}
            >
              <PencilIcon /> Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={dangerButtonClass}
              aria-label={`Delete ${category.name}`}
            >
              <TrashIcon /> Delete
            </button>
          </div>
        ) : null}
      </div>

      {editing ? (
        <form
          key={`${category.name}-${category.color}`}
          action={editAction}
          className="mt-4 space-y-3 border-t border-stone-100 pt-4"
        >
          <input type="hidden" name="id" value={category.id} />
          <FormMessage state={editState} />
          <div>
            <label htmlFor={`edit-${category.id}-name`} className={labelClass}>
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id={`edit-${category.id}-name`}
              name="name"
              type="text"
              required
              maxLength={60}
              defaultValue={category.name}
              className={inputClass}
              autoComplete="off"
            />
            <FieldError message={editState.fieldErrors?.name} />
          </div>
          <ColorField
            idPrefix={`edit-${category.id}`}
            defaultValue={category.color}
            error={editState.fieldErrors?.color}
          />
          <div className="flex justify-end gap-2">
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
        <div className="mt-4 space-y-3 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-900">
            Delete <strong>{category.name}</strong>? This cannot be undone.
          </p>
          <FormMessage state={deleteState} />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={category.id} />
              <SubmitButton variant="danger" pendingText="Deleting…" className="px-3 py-2">
                <TrashIcon /> Yes, delete
              </SubmitButton>
            </form>
          </div>
        </div>
      ) : null}
    </li>
  );
}
