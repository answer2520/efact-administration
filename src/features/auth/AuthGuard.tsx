"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "./session";

/**
 * Garde d'authentification pour le groupe de routes `(admin)`.
 *
 * Vérifie la présence d'un token côté client et redirige vers `/connexion`
 * si l'utilisateur n'est pas authentifié. Affiche un loader pendant la vérification.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`/connexion?callbackUrl=${callbackUrl}`);
      return;
    }
    setChecking(false);
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Vérification de l'authentification…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
