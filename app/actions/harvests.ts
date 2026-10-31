"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { errorState, successState, type ActionState } from "@/lib/action-state";
import {
  fieldErrorsFrom,
  harvestSchema,
  harvestStatusSchema,
  idSchema,
} from "@/lib/validation";

function harvestFormData(formData: FormData) {
  return {
    name: formData.get("name") ?? "",
    crop: formData.get("crop") ?? "",
    startDate: formData.get("startDate") ?? "",
    endDate: formData.get("endDate") ?? "",
    notes: formData.get("notes") ?? "",
  };
}

function revalidateHarvest(harvestId: string) {
  revalidatePath("/");
  revalidatePath(`/harvests/${harvestId}`);
}

export async function createHarvest(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = harvestSchema.safeParse(harvestFormData(formData));

  if (!parsed.success) {
    return errorState(
      "Please fix the highlighted fields.",
      fieldErrorsFrom(parsed.error),
    );
  }

  const harvest = await prisma.harvest.create({
    data: { ...parsed.data, status: "ACTIVE" },
    select: { id: true },
  });

  revalidatePath("/");
  redirect(`/harvests/${harvest.id}`);
}

export async function updateHarvest(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return errorState("Missing harvest id.");

  const parsed = harvestSchema.safeParse(harvestFormData(formData));
  if (!parsed.success) {
    return errorState(
      "Please fix the highlighted fields.",
      fieldErrorsFrom(parsed.error),
    );
  }

  const existing = await prisma.harvest.findUnique({
    where: { id: id.data },
    select: { id: true },
  });
  if (!existing) return errorState("That harvest no longer exists.");

  await prisma.harvest.update({
    where: { id: id.data },
    data: parsed.data,
  });

  revalidateHarvest(id.data);
  return successState("Harvest updated.");
}

export async function deleteHarvest(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return errorState("Missing harvest id.");

  const existing = await prisma.harvest.findUnique({
    where: { id: id.data },
    select: { id: true },
  });
  if (!existing) return errorState("That harvest no longer exists.");

  await prisma.harvest.delete({ where: { id: id.data } });

  revalidatePath("/");
  redirect("/");
}

export async function setHarvestStatus(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = idSchema.safeParse(formData.get("id"));
  const status = harvestStatusSchema.safeParse(formData.get("status"));

  if (!id.success || !status.success) {
    return errorState("Could not update the harvest status.");
  }

  const existing = await prisma.harvest.findUnique({
    where: { id: id.data },
    select: { id: true },
  });
  if (!existing) return errorState("That harvest no longer exists.");

  await prisma.harvest.update({
    where: { id: id.data },
    data: { status: status.data },
  });

  revalidateHarvest(id.data);
  return successState(
    status.data === "CLOSED"
      ? "Harvest closed. Expenses are now read-only."
      : "Harvest reopened.",
  );
}
