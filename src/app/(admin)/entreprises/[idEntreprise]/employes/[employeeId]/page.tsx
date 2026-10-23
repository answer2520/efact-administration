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
  const params = useParams<{ idEntreprise: string; employeeId: string }>();
  const { idEntreprise, employeeId } = params;

  const [employe, setEmploye] = useState<Employe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  async function fetchEmploye() {
    try {
      const data = await employesApi.getById(idEntreprise, employeeId);
      setEmploye(data);
      setCode(data.activationCode ?? null);
      setExpiresAt(data.activationCodeExpiresAt ?? null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(getErrorMessage(err.code));
      } else {
        setError(getErrorMessage("INTERNAL_ERROR"));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    fetchEmploye();
  }, [idEntreprise, employeeId]);

  async function handleGenerateCode() {
    setGenerating(true);
    setError(null);
    try {
      const result = await employesApi.generateActivationCode(idEntreprise, employeeId);
      setCode(result.code);
      setExpiresAt(result.expiresAt);
      await fetchEmploye();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(getErrorMessage(err.code));
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleUnlink() {
    setUnlinking(true);
    setError(null);
    try {
      const updated = await employesApi.unlinkDevice(idEntreprise, employeeId);
      setEmploye(updated);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(getErrorMessage(err.code));
      }
    } finally {
      setUnlinking(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        Chargement…
      </div>
    );
  }

  if (error || !employe) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Employé introuvable."}
        </div>
        <Link
          href={`/entreprises/${idEntreprise}`}
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Retour à l&apos;entreprise
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/entreprises/${idEntreprise}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Retour à l&apos;entreprise
        </Link>
        <h1 className="mt-2 text-xl font-bold text-gray-900">
          {employe.prenom} {employe.nom}
        </h1>
        <p className="text-sm text-gray-500">Matricule : {employe.matricule}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Infos */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-gray-700">Informations</h2>
          <dl className="flex flex-col gap-3 text-sm">
            {employe.telephone && (
              <div>
                <dt className="text-gray-500">Téléphone</dt>
                <dd className="text-gray-900">{employe.telephone}</dd>
              </div>
            )}
            {employe.email && (
              <div>
                <dt className="text-gray-500">E-mail</dt>
                <dd className="text-gray-900">{employe.email}</dd>
              </div>
            )}
            <div>
              <dt className="text-gray-500">Statut</dt>
              <dd>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  employe.actif
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {employe.actif ? "Actif" : "Inactif"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Code d'activation + appareil */}
        <div className="flex flex-col gap-4">
          <ActivationCode
            code={code}
            expiresAt={expiresAt}
            generating={generating}
            onGenerate={handleGenerateCode}
          />
          <DeviceCard
            device={employe.device ?? null}
            unlinking={unlinking}
            onUnlink={handleUnlink}
          />
        </div>
      </div>
    </div>
  );
}
