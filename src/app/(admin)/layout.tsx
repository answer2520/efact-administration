"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthGuard } from "@/features/auth/AuthGuard";
import { clearAuthToken } from "@/features/auth/session";
import { authApi } from "@/features/auth/api";

/* ── Icônes SVG inline légères ─────────────────────────────────────────── */
function IconBuilding() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11M19 10v11M9 10v4m6-4v4" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
  );
}

/* ── Items de navigation ───────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    href: "/entreprises",
    label: "Entreprises",
    icon: <IconBuilding />,
    /** On est actif si le path commence par /entreprises */
    matchPrefix: "/entreprises",
  },
];

/* ── Layout ─────────────────────────────────────────────────────────────── */
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
      <div className="flex min-h-screen">

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <aside className="flex w-56 flex-col border-r border-[#D2DCE8] bg-white">

          {/* Logo */}
          <div className="flex h-14 items-center border-b border-[#D2DCE8] px-5">
            <Link href="/entreprises" className="text-xl font-semibold tracking-tight">
              <span className="text-[#0052CC]">e</span>
              <span className="text-[#00A8FF]">Fact</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.matchPrefix);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#EFF3F8] text-[#0052CC]"
                      : "text-[#6B778C] hover:bg-[#F4F5F7] hover:text-[#172B4D]"
                  }`}
                >
                  <span className={active ? "text-[#0052CC]" : "text-[#6B778C]"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Déconnexion */}
          <div className="border-t border-[#D2DCE8] p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#6B778C] transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <IconLogout />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ── Contenu principal ──────────────────────────────────── */}
        <div className="flex flex-1 flex-col">

          {/* Breadcrumb header */}
          <header className="flex h-14 items-center border-b border-[#D2DCE8] bg-white px-6">
            <Breadcrumb pathname={pathname} />
          </header>

          <main className="flex-1 bg-[#E4E9F0] p-6">
            {children}
          </main>
        </div>

      </div>
    </AuthGuard>
  );
}

/* ── Breadcrumb ─────────────────────────────────────────────────────────── */
function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);

  // Labels lisibles pour les segments connus
  const labels: Record<string, string> = {
    entreprises: "Entreprises",
    nouvelle: "Nouvelle",
    nouveau: "Nouveau",
    modifier: "Modifier",
    roles: "Rôles",
    employes: "Employés",
  };

  const crumbs: { label: string; href: string }[] = [];
  let path = "";

  for (const seg of segments) {
    path += `/${seg}`;
    // UUIDs → on affiche un label générique
    const isId = /^[0-9a-f-]{20,}$/i.test(seg);
    crumbs.push({
      label: isId ? "Détail" : (labels[seg] ?? seg),
      href: path,
    });
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[#D2DCE8]">/</span>}
            {isLast ? (
              <span className="font-medium text-[#172B4D]">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-[#6B778C] hover:text-[#0052CC]">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
