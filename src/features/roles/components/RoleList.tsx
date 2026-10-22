"use client";

import Link from "next/link";
import type { Role } from "../types";

export interface RoleListProps {
  roles: Role[];
  loading?: boolean;
}

export function RoleList({ roles, loading }: RoleListProps) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        Chargement des rôles…
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        Aucun rôle trouvé.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
            <th className="px-4 py-3 font-medium text-gray-600">Description</th>
            <th className="px-4 py-3 font-medium text-gray-600">Permissions</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {roles.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{r.nom}</td>
              <td className="px-4 py-3 text-gray-600">{r.description ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">
                {r.permissions.length} permission{r.permissions.length > 1 ? "s" : ""}
              </td>
              <td className="px-4 py-3 text-right">
                <Link href="#" className="text-blue-600 hover:underline">
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
