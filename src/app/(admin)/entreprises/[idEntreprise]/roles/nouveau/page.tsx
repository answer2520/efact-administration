"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RoleForm } from "@/features/roles/components/RoleForm";
import { rolesApi } from "@/features/roles/api";
import type { RoleFormData } from "@/features/roles/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function NouveauRolePage() {
  const { idEntreprise } = useParams<{ idEntreprise: string }>();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: RoleFormData) {
    setSubmitting(true);
    setError(null);
    try {
      await rolesApi.create(idEntreprise, data);
      router.push(`/entreprises/${idEntreprise}?tab=roles`);
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href={`/entreprises/${idEntreprise}?tab=roles`} className="text-sm text-[#6B778C] hover:text-[#172B4D]">
          ← Retour aux rôles
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-[#172B4D]">Nouveau rôle</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <RoleForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
