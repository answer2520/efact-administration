"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthGuard } from "@/features/auth/AuthGuard";
import { clearAuthToken } from "@/features/auth/session";
import { authApi } from "@/features/auth/api";

const navItems = [
  { href: "/entreprises", label: "Entreprises" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try { await authApi.logout(); } catch { /* mode fake */ }
    clearAuthToken();
    router.replace("/connexion");
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">

        {/* ── Header ───────────────────────────────────────────────── */}
        <header className="flex h-14 items-center justify-between border-b border-[#D2DCE8] bg-white px-6 shadow-sm">
          <div className="flex items-center gap-8">
            {/* Logo / marque */}
            <Link href="/entreprises" className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-[#0052CC]">
                e<span className="text-[#00A8FF]">Fact</span>
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#EFF3F8] text-[#0052CC]"
                        : "text-[#6B778C] hover:bg-[#F4F5F7] hover:text-[#172B4D]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-[#6B778C] transition-colors hover:text-[#172B4D]"
          >
            Déconnexion
          </button>
        </header>

        {/* ── Contenu ──────────────────────────────────────────────── */}
        <main className="flex-1 bg-[#E4E9F0] p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
