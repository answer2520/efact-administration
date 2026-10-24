"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { EmployeList } from "@/features/employes/components/EmployeList";
import { RoleList } from "@/features/roles/components/RoleList";
import { entreprisesApi } from "@/features/entreprises/api";
import { employesApi } from "@/features/employes/api";
import { rolesApi } from "@/features/roles/api";
import type { Entreprise } from "@/features/entreprises/types";
import type { Employe } from "@/features/employes/types";
import type { Role } from "@/features/roles/types";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api-error";
import { getErrorMessage } from "@/lib/error-messages";

type Tab = "infos" | "roles" | "employes";

export default function EntrepriseDetailPage() {
  const { idEntreprise } = useParams<{ idEntreprise: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = (searchParams.get("tab") as Tab | null) ?? "infos";

  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(initialTab);

  // Suppression de rôle
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function loadData() {
    setLoading(true);
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
  }

  useEffect(() => { loadData(); }, [idEntreprise]); // eslint-disable-line react-hooks/exhaustive-deps

  function changeTab(t: Tab) {
    setTab(t);
    router.replace(`/entreprises/${idEntreprise}?tab=${t}`, { scroll: false });
  }

  async function handleDeleteRole(role: Role) {
    if (!confirm(`Supprimer le rôle « ${role.label} » ?`)) return;
    setDeletingRoleId(role.id);
    setDeleteError(null);
    try {
      await rolesApi.delete(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
    } catch (err) {
      setDeleteError(err instanceof ApiError ? getErrorMessage(err.code) : getErrorMessage("INTERNAL_ERROR"));
    } finally {
      setDeletingRoleId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-[#6B778C]">
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
        <Link href="/entreprises" className="mt-4 inline-block text-sm text-[#0052CC] hover:underline">
          ← Retour aux entreprises
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "infos",    label: "Infos" },
    { key: "roles",    label: `Rôles (${roles.length})` },
    { key: "employes", label: `Employés (${employes.length})` },
  ];

  return (
    <div className="mx-auto max-w-5xl">

      {/* ── En-tête ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <Link href="/entreprises" className="text-sm text-[#6B778C] hover:text-[#172B4D]">
          ← Retour aux entreprises
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#172B4D]">{entreprise.nomEntreprise}</h1>
          <Link href={`/entreprises/${idEntreprise}/modifier`}>
            <Button variant="secondary" size="sm">Modifier</Button>
          </Link>
        </div>
        <p className="mt-1 font-mono text-sm text-[#6B778C]">NIF : {entreprise.nif}</p>
      </div>

      {/* ── Onglets ──────────────────────────────────────────────── */}
      <div className="mb-6 flex gap-1 border-b border-[#D2DCE8]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => changeTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-[#0052CC] text-[#0052CC]"
                : "border-transparent text-[#6B778C] hover:text-[#172B4D]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Infos ────────────────────────────────────────────────── */}
      {tab === "infos" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <dt className="text-[#6B778C]">NIF</dt>
            <dd className="font-mono text-[#172B4D]">{entreprise.nif}</dd>
            <dt className="text-[#6B778C]">Username OBR</dt>
            <dd className="text-[#172B4D]">{entreprise.username}</dd>
          </dl>
        </div>
      )}

      {/* ── Rôles ────────────────────────────────────────────────── */}
      {tab === "roles" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#6B778C]">
              Gérez les rôles et leurs permissions pour cette entreprise.
            </p>
            <Link href={`/entreprises/${idEntreprise}/roles/nouveau`}>
              <Button size="sm">+ Nouveau rôle</Button>
            </Link>
          </div>

          {deleteError && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {deleteError}
            </div>
          )}

          <RoleList
            roles={roles}
            loading={false}
            onEdit={(role) => router.push(`/entreprises/${idEntreprise}/roles/${role.id}/modifier`)}
            onDelete={handleDeleteRole}
            deletingId={deletingRoleId}
          />
        </div>
      )}

      {/* ── Employés ─────────────────────────────────────────────── */}
      {tab === "employes" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#6B778C]">
              Liste des employés rattachés à cette entreprise.
            </p>
            <Link href={`/entreprises/${idEntreprise}/employes/nouveau`}>
              <Button size="sm">+ Nouvel employé</Button>
            </Link>
          </div>
          <EmployeList
            employes={employes}
            idEntreprise={idEntreprise}
            loading={false}
          />
        </div>
      )}
    </div>
  );
}
