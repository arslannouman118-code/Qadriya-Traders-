"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Hides the shop header, footer and cart on the private /admin pages.
export function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
