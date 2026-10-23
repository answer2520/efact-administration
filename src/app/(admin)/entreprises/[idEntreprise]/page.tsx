"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { EmployeList } from "@/features/employes/components/EmployeList";
import { RoleList } from "@/features/roles/components/RoleList";
import { entreprisesApi } from "@/features/entreprises/api";
import { employesApi } from "@/features/employes/api";
import { rolesApi } from "@/features/roles/api";
import type { Entreprise } from "@/features/entreprises/types";
import type { Employe } from "@/features/employes/types";
import type { Role } from "@/features/roles/types";
import { Button } from "@/components/ui/Button";

type Tab = "infos" | "roles" | "employes";

export default function EntrepriseDetailPage() {
  const { idEntreprise } = useParams<{ idEntreprise: string }>();

  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("infos");

  useEffect(() => {
    Promise.all([
      entreprisesApi.getById(idEntreprise),
      employesApi.list(idEntreprise),
      rolesApi.list(idEntreprise),
    ])
      .then(([ent, emp, rls]) => {
        setEntreprise(ent);
        setEmployes(emp);
        setRoles(rls);
      })
      .catch(() => setError("Impossible de charger les données de l'entreprise."))
      .finally(() => setLoading(false));
  }, [idEntreprise]);

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-gray-400">Chargement…</div>;
  }

  if (error || !entreprise) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Entreprise introuvable."}
        </div>
        <Link href="/entreprises" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← Retour aux entreprises
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "infos", label: "Infos" },
    { key: "roles", label: `Rôles (${roles.length})` },
    { key: "employes", label: `Employés (${employes.length})` },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link href="/entreprises" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour aux entreprises
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{entreprise.nomEntreprise}</h1>
          <Link href={`/entreprises/${idEntreprise}/modifier`}>
            <Button variant="secondary" size="sm">Modifier</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "infos" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <dt className="text-gray-500">NIF</dt>
            <dd className="font-mono text-gray-900">{entreprise.nif}</dd>
            <dt className="text-gray-500">Username OBR</dt>
            <dd className="text-gray-900">{entreprise.username}</dd>
          </dl>
        </div>
      )}

      {tab === "roles" && (
        <RoleList roles={roles} loading={false} />
      )}

      {tab === "employes" && (
        <div>
          <div className="mb-4 flex justify-end">
            <Link href={`/entreprises/${idEntreprise}/employes/nouveau`}>
              <Button size="sm">+ Nouvel employé</Button>
            </Link>
          </div>
          <EmployeList employes={employes} idEntreprise={idEntreprise} loading={false} />
        </div>
      )}
    </div>
  );
}
