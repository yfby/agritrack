export function HarvestListSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      <div className="h-10 w-40 animate-pulse rounded-lg bg-stone-200" />
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="rounded-2xl border border-stone-200 bg-white p-4"
        >
          <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-stone-100" />
          <div className="mt-4 flex justify-between">
            <div className="h-5 w-28 animate-pulse rounded bg-stone-100" />
            <div className="h-5 w-20 animate-pulse rounded bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label={`Loading ${title}`}>
      <div className="space-y-2">
        <div className="h-8 w-1/2 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-stone-100" />
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-stone-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
