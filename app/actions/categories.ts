"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { errorState, successState, type ActionState } from "@/lib/action-state";
import {
  categorySchema,
  fieldErrorsFrom,
  idSchema,
} from "@/lib/validation";

function revalidateCategoryViews() {
  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath("/harvests/[id]", "page");
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = categorySchema.safeParse({
    name: formData.get("name") ?? "",
    color: formData.get("color") ?? "",
  });

  if (!parsed.success) {
    return errorState(
      "Please fix the highlighted fields.",
      fieldErrorsFrom(parsed.error),
    );
  }

  try {
    await prisma.category.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return errorState("That category already exists.", {
        name: "A category with this name already exists.",
      });
    }
    throw error;
  }

  revalidateCategoryViews();
  return successState("Category added.");
}

export async function updateCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return errorState("Missing category id.");

  const parsed = categorySchema.safeParse({
    name: formData.get("name") ?? "",
    color: formData.get("color") ?? "",
  });

  if (!parsed.success) {
    return errorState(
      "Please fix the highlighted fields.",
      fieldErrorsFrom(parsed.error),
    );
  }

  const existing = await prisma.category.findUnique({
    where: { id: id.data },
    select: { id: true },
  });
  if (!existing) return errorState("That category no longer exists.");

  try {
    await prisma.category.update({
      where: { id: id.data },
      data: parsed.data,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return errorState("That category already exists.", {
        name: "A category with this name already exists.",
      });
    }
    throw error;
  }

  revalidateCategoryViews();
  return successState("Category updated.");
}

export async function deleteCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return errorState("Missing category id.");

  const category = await prisma.category.findUnique({
    where: { id: id.data },
    select: {
      id: true,
      name: true,
      _count: { select: { expenses: true } },
    },
  });
  if (!category) return errorState("That category no longer exists.");

  if (category._count.expenses > 0) {
    const count = category._count.expenses;
    return errorState(
      `Cannot delete "${category.name}" — ${count} ${
        count === 1 ? "expense uses" : "expenses use"
      } it. Move or delete those expenses first.`,
    );
  }

  try {
    await prisma.category.delete({ where: { id: id.data } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return errorState(
        "This category is still used by an expense. Remove those expenses first.",
      );
    }
    throw error;
  }

  revalidateCategoryViews();
  return successState("Category deleted.");
}
