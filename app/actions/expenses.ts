"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { errorState, successState, type ActionState } from "@/lib/action-state";
import {
  expenseSchema,
  fieldErrorsFrom,
  idSchema,
} from "@/lib/validation";

async function getOpenHarvest(harvestId: string) {
  const harvest = await prisma.harvest.findUnique({
    where: { id: harvestId },
    select: { id: true, status: true },
  });

  if (!harvest) return { error: "That harvest no longer exists." } as const;
  if (harvest.status === "CLOSED") {
    return {
      error: "This harvest is closed. Reopen it before changing expenses.",
    } as const;
  }

  return { harvest } as const;
}

function revalidateExpenseViews(harvestId: string) {
  revalidatePath("/");
  revalidatePath(`/harvests/${harvestId}`);
}

export async function createExpense(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const harvestId = idSchema.safeParse(formData.get("harvestId"));
  if (!harvestId.success) return errorState("Missing harvest id.");

  const parsed = expenseSchema.safeParse({
    amount: formData.get("amount") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    date: formData.get("date") ?? "",
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return errorState(
      "Please fix the highlighted fields.",
      fieldErrorsFrom(parsed.error),
    );
  }

  const open = await getOpenHarvest(harvestId.data);
  if ("error" in open) return errorState(open.error);

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true },
  });
  if (!category) return errorState("Choose a valid category.");

  await prisma.expense.create({
    data: {
      harvestId: harvestId.data,
      categoryId: parsed.data.categoryId,
      amountCents: parsed.data.amount,
      date: parsed.data.date,
      description: parsed.data.description,
    },
  });

  revalidateExpenseViews(harvestId.data);
  return successState("Expense added.");
}

export async function updateExpense(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return errorState("Missing expense id.");

  const parsed = expenseSchema.safeParse({
    amount: formData.get("amount") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    date: formData.get("date") ?? "",
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return errorState(
      "Please fix the highlighted fields.",
      fieldErrorsFrom(parsed.error),
    );
  }

  const expense = await prisma.expense.findUnique({
    where: { id: id.data },
    select: { id: true, harvestId: true },
  });
  if (!expense) return errorState("That expense no longer exists.");

  const open = await getOpenHarvest(expense.harvestId);
  if ("error" in open) return errorState(open.error);

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true },
  });
  if (!category) return errorState("Choose a valid category.");

  await prisma.expense.update({
    where: { id: id.data },
    data: {
      categoryId: parsed.data.categoryId,
      amountCents: parsed.data.amount,
      date: parsed.data.date,
      description: parsed.data.description,
    },
  });

  revalidateExpenseViews(expense.harvestId);
  return successState("Expense updated.");
}

export async function deleteExpense(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return errorState("Missing expense id.");

  const expense = await prisma.expense.findUnique({
    where: { id: id.data },
    select: { id: true, harvestId: true },
  });
  if (!expense) return errorState("That expense no longer exists.");

  const open = await getOpenHarvest(expense.harvestId);
  if ("error" in open) return errorState(open.error);

  await prisma.expense.delete({ where: { id: id.data } });

  revalidateExpenseViews(expense.harvestId);
  return successState("Expense deleted.");
}
