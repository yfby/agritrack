export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Changes on every successful action; useful for resetting forms via `key`. */
  token?: string;
};

export const initialActionState: ActionState = { status: "idle" };

export function errorState(
  message?: string,
  fieldErrors?: Record<string, string>,
): ActionState {
  return { status: "error", message, fieldErrors };
}

export function successState(message?: string): ActionState {
  return {
    status: "success",
    message,
    token: globalThis.crypto.randomUUID(),
  };
}
