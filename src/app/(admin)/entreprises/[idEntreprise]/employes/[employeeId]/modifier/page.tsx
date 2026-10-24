"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EmployeForm } from "@/features/employes/components/EmployeForm";
import { employesApi } from "@/features/employes/api";
import { rolesApi } from "@/features/roles/api";
import type { Employe, EmployeUpdateData } from "@/features/employes/types";
import type { Role } from "@/features/roles/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function ModifierEmployePage() {
  const { idEntreprise, employeeId } = useParams<{ idEntreprise: string; employeeId: string }>();
  const router = useRouter();

  const [employe, setEmploye] = useState<Employe | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      employesApi.getById(employeeId),
      rolesApi.list(idEntreprise),
    ])
      .then(([emp, rls]) => { setEmploye(emp); setRoles(rls); })
      .catch(() => setError("Impossible de charger les données."))
      .finally(() => setLoading(false));
  }, [idEntreprise, employeeId]);

  async function handleSubmit(data: EmployeUpdateData) {
    setSubmitting(true);
    setError(null);
    try {
      await employesApi.update(employeeId, data);
      router.push(`/entreprises/${idEntreprise}/employes/${employeeId}`);
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
        <Link
          href={`/entreprises/${idEntreprise}/employes/${employeeId}`}
          className="text-sm text-[#6B778C] hover:text-[#172B4D]"
        >
          ← Retour à l&apos;employé
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-[#172B4D]">Modifier l&apos;employé</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {employe && (
          <EmployeForm
            initialData={employe}
            roles={roles}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
