"use client";

import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { ghostButtonClass } from "@/lib/ui";

export function LogoutButton() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <form action={logout}>
      <button type="submit" className={`${ghostButtonClass} px-3 py-2`}>
        Log out
      </button>
    </form>
  );
}
