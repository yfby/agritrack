import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold text-stone-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-1 max-w-sm text-sm text-stone-500">
        The harvest may have been deleted, or the link is incorrect.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
      >
        Back to harvests
      </Link>
    </div>
  );
}
