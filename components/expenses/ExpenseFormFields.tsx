import { FieldError } from "@/components/ui/FormMessage";
import { CURRENCY_SYMBOL } from "@/lib/money";
import type { CategoryOption } from "@/lib/queries";
import { inputClass, labelClass } from "@/lib/ui";

export type ExpenseFormValues = {
  amount: string;
  categoryId: string;
  date: string;
  description: string;
};

export function ExpenseFormFields({
  idPrefix,
  values,
  categories,
  errors,
}: {
  idPrefix: string;
  values: ExpenseFormValues;
  categories: CategoryOption[];
  errors?: Record<string, string>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-amount`} className={labelClass}>
          Amount <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-stone-400">
            {CURRENCY_SYMBOL}
          </span>
          <input
            id={`${idPrefix}-amount`}
            name="amount"
            type="text"
            required
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            defaultValue={values.amount}
            className={`${inputClass} pl-8 text-base font-semibold tabular-nums`}
          />
        </div>
        <FieldError message={errors?.amount} />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-category`} className={labelClass}>
          Category <span className="text-red-600">*</span>
        </label>
        <select
          id={`${idPrefix}-category`}
          name="categoryId"
          required
          defaultValue={values.categoryId}
          className={inputClass}
        >
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FieldError message={errors?.categoryId} />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-date`} className={labelClass}>
          Date <span className="text-red-600">*</span>
        </label>
        <input
          id={`${idPrefix}-date`}
          name="date"
          type="date"
          required
          defaultValue={values.date}
          className={inputClass}
        />
        <FieldError message={errors?.date} />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-description`} className={labelClass}>
          Description{" "}
          <span className="font-normal normal-case text-stone-400">
            (optional)
          </span>
        </label>
        <input
          id={`${idPrefix}-description`}
          name="description"
          type="text"
          maxLength={500}
          autoComplete="off"
          defaultValue={values.description}
          placeholder="e.g. 2 bags of urea"
          className={inputClass}
        />
        <FieldError message={errors?.description} />
      </div>
    </div>
  );
}
