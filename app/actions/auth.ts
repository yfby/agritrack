"use server";

import { redirect } from "next/navigation";
import { errorState, type ActionState } from "@/lib/action-state";
import {
  endSession,
  isPasswordConfigured,
  startSession,
  verifyPassword,
} from "@/lib/auth";
import { passwordSchema } from "@/lib/validation";

export async function login(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = passwordSchema.safeParse(formData.get("password") ?? "");
  if (!parsed.success) return errorState("Enter the password.");

  if (!isPasswordConfigured()) {
    return errorState("The app password is not configured. Set APP_PASSWORD.");
  }
  if (!verifyPassword(parsed.data)) return errorState("Incorrect password.");

  await startSession();
  redirect("/");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}
