import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-10 text-center">
      {icon ? (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
