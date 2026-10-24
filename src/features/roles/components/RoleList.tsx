"use client";

import type { Role } from "../types";

export interface RoleListProps {
  roles: Role[];
  loading?: boolean;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  /** id du rôle en cours de suppression (affiche un spinner). */
  deletingId?: string | null;
}

export function RoleList({ roles, loading, onEdit, onDelete, deletingId }: RoleListProps) {
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
            <th className="px-4 py-3 font-medium text-gray-600">Libellé</th>
            <th className="px-4 py-3 font-medium text-gray-600">Permissions</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {roles.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-900">
                {r.label}
                {r.isDefaultAdminRole && (
                  <span className="ml-2 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    Admin
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-500">
                {r.isDefaultAdminRole
                  ? "Tous les droits"
                  : `${r.rights.length} permission${r.rights.length > 1 ? "s" : ""}`}
              </td>
              <td className="px-4 py-3 text-right">
                {!r.isDefaultAdminRole && (
                  <div className="flex justify-end gap-3">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(r)}
                        className="text-[#0052CC] hover:underline"
                      >
                        Modifier
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(r)}
                        disabled={deletingId === r.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === r.id ? "Suppression…" : "Supprimer"}
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
