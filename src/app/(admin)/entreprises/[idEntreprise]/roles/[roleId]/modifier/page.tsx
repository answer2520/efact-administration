"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RoleForm } from "@/features/roles/components/RoleForm";
import { rolesApi } from "@/features/roles/api";
import type { Role, RoleFormData } from "@/features/roles/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function ModifierRolePage() {
  const { idEntreprise, roleId } = useParams<{ idEntreprise: string; roleId: string }>();
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rolesApi.list(idEntreprise)
      .then((roles) => {
        const found = roles.find((r) => r.id === roleId) ?? null;
        if (!found) setError("Rôle introuvable.");
        else if (found.isDefaultAdminRole) setError("Le rôle Admin ne peut pas être modifié.");
        else setRole(found);
      })
      .catch(() => setError("Impossible de charger le rôle."))
      .finally(() => setLoading(false));
  }, [idEntreprise, roleId]);

  async function handleSubmit(data: RoleFormData) {
    setSubmitting(true);
    setError(null);
    try {
      await rolesApi.update(roleId, data);
      router.push(`/entreprises/${idEntreprise}?tab=roles`);
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-[#6B778C]">Chargement…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href={`/entreprises/${idEntreprise}?tab=roles`} className="text-sm text-[#6B778C] hover:text-[#172B4D]">
          ← Retour aux rôles
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-[#172B4D]">Modifier le rôle</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {role && <RoleForm initialData={role} onSubmit={handleSubmit} submitting={submitting} />}
      </div>
    </div>
  );
}
