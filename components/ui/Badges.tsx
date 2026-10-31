export function StatusBadge({ status }: { status: string }) {
  const closed = status === "CLOSED";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        closed
          ? "bg-stone-100 text-stone-600 ring-1 ring-stone-200"
          : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          closed ? "bg-stone-400" : "bg-emerald-500"
        }`}
        aria-hidden
      />
      {closed ? "Closed" : "Active"}
    </span>
  );
}

export function CategoryBadge({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium text-stone-800"
      style={{
        backgroundColor: `${color}14`,
        borderColor: `${color}40`,
      }}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="truncate">{name}</span>
    </span>
  );
}
