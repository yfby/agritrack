import { FieldError } from "@/components/ui/FormMessage";
import { inputClass, labelClass } from "@/lib/ui";

export type HarvestFormValues = {
  name: string;
  crop: string;
  startDate: string;
  endDate: string;
  notes: string;
};

export function HarvestFormFields({
  idPrefix,
  values,
  errors,
}: {
  idPrefix: string;
  values: HarvestFormValues;
  errors?: Record<string, string>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-name`} className={labelClass}>
          Harvest name <span className="text-red-600">*</span>
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          type="text"
          required
          maxLength={120}
          defaultValue={values.name}
          placeholder="Rice – Wet Season 2026"
          className={inputClass}
          autoComplete="off"
        />
        <FieldError message={errors?.name} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-crop`} className={labelClass}>
          Crop <span className="font-normal normal-case text-stone-400">(optional)</span>
        </label>
        <input
          id={`${idPrefix}-crop`}
          name="crop"
          type="text"
          maxLength={80}
          defaultValue={values.crop}
          placeholder="Rice"
          className={inputClass}
          autoComplete="off"
        />
        <FieldError message={errors?.crop} />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-startDate`} className={labelClass}>
          Start date <span className="text-red-600">*</span>
        </label>
        <input
          id={`${idPrefix}-startDate`}
          name="startDate"
          type="date"
          required
          defaultValue={values.startDate}
          className={inputClass}
        />
        <FieldError message={errors?.startDate} />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-endDate`} className={labelClass}>
          End date <span className="font-normal normal-case text-stone-400">(optional)</span>
        </label>
        <input
          id={`${idPrefix}-endDate`}
          name="endDate"
          type="date"
          defaultValue={values.endDate}
          min={values.startDate || undefined}
          className={inputClass}
        />
        <FieldError message={errors?.endDate} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-notes`} className={labelClass}>
          Notes <span className="font-normal normal-case text-stone-400">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          rows={2}
          maxLength={2000}
          defaultValue={values.notes}
          placeholder="Anything worth remembering about this harvest…"
          className={`${inputClass} resize-y`}
        />
        <FieldError message={errors?.notes} />
      </div>
    </div>
  );
}
