"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { EntrepriseForm } from "@/features/entreprises/components/EntrepriseForm";
import { entreprisesApi } from "@/features/entreprises/api";
import type { Entreprise, EntrepriseUpdateData } from "@/features/entreprises/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function ModifierEntreprisePage() {
  const { idEntreprise } = useParams<{ idEntreprise: string }>();
  const router = useRouter();

  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    entreprisesApi.getById(idEntreprise)
      .then(setEntreprise)
      .catch(() => setError("Impossible de charger l'entreprise."))
      .finally(() => setLoading(false));
  }, [idEntreprise]);

  async function handleSubmit(data: EntrepriseUpdateData) {
    setSubmitting(true);
    setError(null);
    try {
      await entreprisesApi.update(idEntreprise, data);
      router.push(`/entreprises/${idEntreprise}`);
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-gray-400">Chargement…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href={`/entreprises/${idEntreprise}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour à l&apos;entreprise
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Modifier l&apos;entreprise</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        {entreprise && (
          <EntrepriseForm
            mode="edit"
            initialData={entreprise}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
