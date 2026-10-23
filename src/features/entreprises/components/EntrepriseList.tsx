"use client";

import Link from "next/link";
import type { Entreprise } from "../types";

export interface EntrepriseListProps {
  entreprises: Entreprise[];
  loading?: boolean;
}

export function EntrepriseList({ entreprises, loading }: EntrepriseListProps) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        Chargement des entreprises…
      </div>
    );
  }

  if (entreprises.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400">
        <p>Aucune entreprise trouvée.</p>
        <Link href="/entreprises/nouvelle" className="text-sm text-blue-600 hover:underline">
          + Ajouter une entreprise
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">NIF</th>
            <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
            <th className="px-4 py-3 font-medium text-gray-600">Username OBR</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entreprises.map((e) => (
            <tr key={e.idEntreprise} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-gray-700">{e.nif}</td>
              <td className="px-4 py-3 text-gray-900">{e.nomEntreprise}</td>
              <td className="px-4 py-3 text-gray-600">{e.username}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/entreprises/${e.idEntreprise}`}
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
