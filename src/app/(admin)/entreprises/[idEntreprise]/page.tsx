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
  const params = useParams<{ idEntreprise: string }>();
  const idEntreprise = params.idEntreprise;

  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("infos");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ent, emp, rls] = await Promise.all([
          entreprisesApi.getById(idEntreprise),
          employesApi.list(idEntreprise),
          rolesApi.list(),
        ]);
        setEntreprise(ent);
        setEmployes(emp);
        setRoles(rls);
      } catch {
        setError("Impossible de charger les données de l'entreprise.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [idEntreprise]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        Chargement…
      </div>
    );
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
    { key: "roles", label: "Rôles" },
    { key: "employes", label: `Employés (${employes.length})` },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link href="/entreprises" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour aux entreprises
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{entreprise.nom}</h1>
          <Link href={`/entreprises/${idEntreprise}/modifier`}>
            <Button variant="secondary" size="sm">Modifier</Button>
          </Link>
        </div>
      </div>

      {/* Onglets */}
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

      {/* Contenu des onglets */}
      {tab === "infos" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <dt className="text-gray-500">NIF</dt>
            <dd className="font-mono text-gray-900">{entreprise.nif}</dd>
            {entreprise.rccm && (
              <>
                <dt className="text-gray-500">RCCM</dt>
                <dd className="font-mono text-gray-900">{entreprise.rccm}</dd>
              </>
            )}
            {entreprise.adresse && (
              <>
                <dt className="text-gray-500">Adresse</dt>
                <dd className="text-gray-900">{entreprise.adresse}</dd>
              </>
            )}
            {entreprise.telephone && (
              <>
                <dt className="text-gray-500">Téléphone</dt>
                <dd className="text-gray-900">{entreprise.telephone}</dd>
              </>
            )}
            {entreprise.email && (
              <>
                <dt className="text-gray-500">E-mail</dt>
                <dd className="text-gray-900">{entreprise.email}</dd>
              </>
            )}
            <dt className="text-gray-500">Statut</dt>
            <dd>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                entreprise.statut === "actif"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {entreprise.statut === "actif" ? "Actif" : "Inactif"}
              </span>
            </dd>
          </dl>
        </div>
      )}

      {tab === "roles" && (
        <div>
          <RoleList roles={roles} loading={false} />
        </div>
      )}

      {tab === "employes" && (
        <div>
          <div className="mb-4 flex justify-end">
            <Link href={`/entreprises/${idEntreprise}/employes`}>
              <Button size="sm">+ Nouvel employé</Button>
            </Link>
          </div>
          <EmployeList employes={employes} entrepriseId={idEntreprise} loading={false} />
        </div>
      )}
    </div>
  );
}
