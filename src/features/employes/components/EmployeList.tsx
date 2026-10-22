"use client";

import Link from "next/link";
import type { Employe } from "../types";

export interface EmployeListProps {
  employes: Employe[];
  entrepriseId: string;
  loading?: boolean;
}

export function EmployeList({ employes, entrepriseId, loading }: EmployeListProps) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        Chargement des employés…
      </div>
    );
  }

  if (employes.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        Aucun employé enregistré.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Matricule</th>
            <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
            <th className="px-4 py-3 font-medium text-gray-600">Téléphone</th>
            <th className="px-4 py-3 font-medium text-gray-600">Appareil</th>
            <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employes.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-gray-700">{e.matricule}</td>
              <td className="px-4 py-3 text-gray-900">
                {e.prenom} {e.nom}
              </td>
              <td className="px-4 py-3 text-gray-600">{e.telephone ?? "—"}</td>
              <td className="px-4 py-3">
                {e.device ? (
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Associé
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    Aucun
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    e.actif
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {e.actif ? "Actif" : "Inactif"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/entreprises/${entrepriseId}/employes/${e.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Voir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
