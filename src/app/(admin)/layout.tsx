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
    try {
      await authApi.logout();
    } catch {
      // Ignorer les erreurs de logout en mode fake
    }
    clearAuthToken();
    router.replace("/connexion");
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        {/* Header / coque de navigation */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-8">
            <Link href="/entreprises" className="text-lg font-bold text-gray-900">
              eFact
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
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
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Déconnexion
          </button>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
