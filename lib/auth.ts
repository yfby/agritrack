import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const COOKIE_NAME = "agritrack_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function configuredPassword(): string | null {
  const password = process.env.APP_PASSWORD;
  return password ? password : null;
}

export function isPasswordConfigured(): boolean {
  return configuredPassword() !== null;
}

function equalHex(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(expiresAt: string): string {
  return createHmac("sha256", configuredPassword() ?? "")
    .update(expiresAt)
    .digest("hex");
}

export function verifyPassword(candidate: string): boolean {
  const password = configuredPassword();
  if (!password) return false;

  const expected = createHash("sha256").update(password).digest("hex");
  const actual = createHash("sha256").update(candidate).digest("hex");
  return equalHex(actual, expected);
}

/** True when the request carries an unexpired, correctly signed session cookie. */
export const isAuthenticated = cache(async (): Promise<boolean> => {
  if (!isPasswordConfigured()) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature || !equalHex(signature, sign(expiresAt))) {
    return false;
  }

  const expiry = Number(expiresAt);
  return Number.isSafeInteger(expiry) && expiry > Date.now();
});

/** Use in pages and data reads; redirects to the login page when signed out. */
export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/login");
}

export async function startSession(): Promise<void> {
  const expiresAt = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  const token = `${expiresAt}.${sign(expiresAt)}`;

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
