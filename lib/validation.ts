import { z } from "zod";
import { parseAmountToCents } from "@/lib/money";
import { parseDateInput } from "@/lib/dates";

const optionalText = (max: number) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(max, `Keep this under ${max} characters`).optional(),
  );

const dateInput = z
  .string()
  .trim()
  .refine((value) => parseDateInput(value) !== null, "Enter a valid date")
  .transform((value) => parseDateInput(value)!);

const optionalDateInput = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .refine((value) => parseDateInput(value) !== null, "Enter a valid date")
    .transform((value) => parseDateInput(value)!)
    .optional(),
);

export const harvestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(120, "Keep the name under 120 characters"),
    crop: optionalText(80),
    startDate: dateInput,
    endDate: optionalDateInput,
    notes: optionalText(2000),
  })
  .refine(
    (data) => !data.endDate || data.endDate >= data.startDate,
    { message: "End date cannot be before the start date", path: ["endDate"] },
  );

export const expenseSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .superRefine((value, ctx) => {
      if (parseAmountToCents(value) === null) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a positive amount with up to 2 decimals",
        });
      }
    })
    .transform((value) => parseAmountToCents(value)!),
  categoryId: z.string().trim().min(1, "Choose a category"),
  date: dateInput,
  description: optionalText(500),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(60, "Keep the name under 60 characters"),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #16a34a")
    .transform((value) => value.toLowerCase()),
});

export const idSchema = z.string().trim().min(1, "Missing id");

export const harvestStatusSchema = z.enum(["ACTIVE", "CLOSED"]);

/** Turns Zod field errors into a flat { field: firstMessage } map. */
export function fieldErrorsFrom(
  error: z.ZodError,
): Record<string, string> {
  const flattened = z.flattenError(error).fieldErrors;
  const result: Record<string, string> = {};

  for (const [key, messages] of Object.entries(flattened)) {
    const first = Array.isArray(messages) ? messages[0] : undefined;
    if (first) result[key] = first;
  }

  return result;
}
