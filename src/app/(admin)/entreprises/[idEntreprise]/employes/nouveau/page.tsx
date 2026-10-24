"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EmployeForm } from "@/features/employes/components/EmployeForm";
import { employesApi } from "@/features/employes/api";
import { rolesApi } from "@/features/roles/api";
import type { Role } from "@/features/roles/types";
import type { EmployeCreateData } from "@/features/employes/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function NouvelEmployePage() {
  const { idEntreprise } = useParams<{ idEntreprise: string }>();
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rolesApi.list(idEntreprise)
      .then(setRoles)
      .catch(() => setError("Impossible de charger les rôles."));
  }, [idEntreprise]);

  async function handleSubmit(data: EmployeCreateData) {
    setSubmitting(true);
    setError(null);
    try {
      await employesApi.create(idEntreprise, data);
      router.push(`/entreprises/${idEntreprise}`);
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href={`/entreprises/${idEntreprise}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour à l'entreprise
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Nouvel employé</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <EmployeForm roles={roles} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
