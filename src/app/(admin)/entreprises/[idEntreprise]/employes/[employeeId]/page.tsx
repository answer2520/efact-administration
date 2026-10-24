"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ActivationCode } from "@/features/employes/components/ActivationCode";
import { DeviceCard } from "@/features/employes/components/DeviceCard";
import { employesApi } from "@/features/employes/api";
import type { Employe } from "@/features/employes/types";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

export default function EmployeDetailPage() {
  const { idEntreprise, employeeId } = useParams<{ idEntreprise: string; employeeId: string }>();

  const [employe, setEmploye] = useState<Employe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Code d'activation local (mis à jour après génération sans refetch)
  const [codeActivation, setCodeActivation] = useState<string | null>(null);
  const [expireLe, setExpireLe] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    employesApi.getById(employeeId)
      .then((data) => {
        setEmploye(data);
        setExpireLe(data.codeActivationExpireLe);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  async function handleGenerateCode() {
    setGenerating(true);
    setError(null);
    try {
      const result = await employesApi.generateActivationCode(employeeId);
      setCodeActivation(result.codeActivation);
      setExpireLe(result.expireLe);
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
    } finally {
      setGenerating(false);
    }
  }

  async function handleUnlink() {
    setUnlinking(true);
    setError(null);
    try {
      const updated = await employesApi.dissocierAppareil(employeeId);
      setEmploye(updated);
    } catch (err) {
      setError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
    } finally {
      setUnlinking(false);
    }
  }

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-gray-400">Chargement…</div>;
  }

  if (error || !employe) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Employé introuvable."}
        </div>
        <Link href={`/entreprises/${idEntreprise}`} className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← Retour à l'entreprise
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href={`/entreprises/${idEntreprise}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour à l'entreprise
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">{employe.nomEmployee}</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ActivationCode
          codeActivation={codeActivation}
          expireLe={expireLe}
          generating={generating}
          onGenerate={handleGenerateCode}
        />
        <DeviceCard
          deviceId={employe.deviceId}
          unlinking={unlinking}
          onUnlink={handleUnlink}
        />
      </div>
    </div>
  );
}
