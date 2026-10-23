"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EntrepriseForm } from "@/features/entreprises/components/EntrepriseForm";
import { entreprisesApi } from "@/features/entreprises/api";
import type { EntrepriseCreateData } from "@/features/entreprises/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function NouvelleEntreprisePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: EntrepriseCreateData) {
    setSubmitting(true);
    setError(null);
    try {
      await entreprisesApi.create(data);
      router.push("/entreprises");
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/entreprises" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour aux entreprises
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">Nouvelle entreprise</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <EntrepriseForm mode="create" onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}
