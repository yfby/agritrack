"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Harvests", matches: (path: string) => path === "/" || path.startsWith("/harvests") },
  { href: "/categories", label: "Categories", matches: (path: string) => path.startsWith("/categories") },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1" aria-label="Main">
      {links.map((link) => {
        const active = link.matches(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              active
                ? "bg-emerald-50 text-emerald-800"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
