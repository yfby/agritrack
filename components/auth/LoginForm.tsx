"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { FieldError, FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { initialActionState } from "@/lib/action-state";
import { cardClass, inputClass, labelClass } from "@/lib/ui";

export function LoginForm() {
  const [state, action] = useActionState(login, initialActionState);

  return (
    <form action={action} className={`${cardClass} space-y-4 p-5`}>
      {state.status !== "idle" ? <FormMessage state={state} /> : null}
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className={inputClass}
          placeholder="Enter the app password"
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>
      <SubmitButton className="w-full" pendingText="Signing in…">
        Log in
      </SubmitButton>
    </form>
  );
}
