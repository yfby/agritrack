"use client";

import { useActionState, useState } from "react";
import {
  deleteHarvest,
  setHarvestStatus,
  updateHarvest,
} from "@/app/actions/harvests";
import { HarvestFormFields } from "@/components/harvests/HarvestFormFields";
import { FormMessage } from "@/components/ui/FormMessage";
import { PencilIcon, TrashIcon } from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { initialActionState } from "@/lib/action-state";
import type { HarvestFormValues } from "@/components/harvests/HarvestFormFields";
import {
  dangerButtonClass,
  ghostButtonClass,
  secondaryButtonClass,
} from "@/lib/ui";

export function HarvestActions({
  harvestId,
  harvestName,
  expenseCount,
  status,
  values,
}: {
  harvestId: string;
  harvestName: string;
  expenseCount: number;
  status: string;
  values: HarvestFormValues;
}) {
  const isClosed = status === "CLOSED";
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [editState, editAction] = useActionState(
    updateHarvest,
    initialActionState,
  );
  const [statusState, statusAction] = useActionState(
    setHarvestStatus,
    initialActionState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteHarvest,
    initialActionState,
  );

  return (
    <div className="mt-4 border-t border-stone-100 pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            setEditing((value) => !value);
          }}
          className={ghostButtonClass}
          aria-expanded={editing}
        >
          <PencilIcon /> Edit harvest
        </button>

        <form action={statusAction}>
          <input type="hidden" name="id" value={harvestId} />
          <input
            type="hidden"
            name="status"
            value={isClosed ? "ACTIVE" : "CLOSED"}
          />
          <SubmitButton variant="secondary" pendingText="Updating…">
            {isClosed ? "Reopen harvest" : "Close harvest"}
          </SubmitButton>
        </form>

        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setConfirming(true);
          }}
          className={dangerButtonClass}
        >
          <TrashIcon /> Delete harvest
        </button>
      </div>

      {statusState.status !== "idle" && statusState.message ? (
        <div className="mt-3">
          <FormMessage state={statusState} />
        </div>
      ) : null}

      {editing ? (
        <form
          key={`${values.name}-${values.crop}-${values.startDate}-${values.endDate}-${values.notes}`}
          action={editAction}
          className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:p-4"
        >
          <input type="hidden" name="id" value={harvestId} />
          {editState.status !== "idle" ? (
            <div className="mb-3">
              <FormMessage state={editState} />
            </div>
          ) : null}
          <HarvestFormFields
            idPrefix="edit-harvest"
            values={values}
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
            Delete <strong>{harvestName}</strong>
            {expenseCount > 0
              ? ` and its ${expenseCount} ${
                  expenseCount === 1 ? "expense" : "expenses"
                }`
              : ""}
            ? This cannot be undone.
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
              <input type="hidden" name="id" value={harvestId} />
              <SubmitButton
                variant="danger"
                pendingText="Deleting…"
                className="px-3 py-2"
              >
                <TrashIcon /> Yes, delete harvest
              </SubmitButton>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
