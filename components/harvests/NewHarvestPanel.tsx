"use client";

import { useActionState, useState } from "react";
import { createHarvest } from "@/app/actions/harvests";
import { HarvestFormFields } from "@/components/harvests/HarvestFormFields";
import { FormMessage } from "@/components/ui/FormMessage";
import { PlusIcon } from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { initialActionState } from "@/lib/action-state";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

export function NewHarvestPanel({ today }: { today: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createHarvest, initialActionState);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-stone-900">
            Your harvests
          </h2>
          <p className="text-sm text-stone-500">
            Newest first. Tap a harvest to log expenses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className={`${open ? secondaryButtonClass : primaryButtonClass} shrink-0`}
        >
          {open ? (
            "Cancel"
          ) : (
            <>
              <PlusIcon /> New harvest
            </>
          )}
        </button>
      </div>

      {open ? (
        <form
          action={formAction}
          className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <FormMessage state={state} />
          <HarvestFormFields
            idPrefix="new-harvest"
            values={{
              name: "",
              crop: "",
              startDate: today,
              endDate: "",
              notes: "",
            }}
            errors={state.fieldErrors}
          />
          <div className="flex flex-col-reverse gap-2 border-t border-stone-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <SubmitButton pendingText="Creating…">Create harvest</SubmitButton>
          </div>
        </form>
      ) : null}
    </div>
  );
}
