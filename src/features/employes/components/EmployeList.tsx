"use client";

import Link from "next/link";
import type { Employe } from "../types";

export interface EmployeListProps {
  employes: Employe[];
  idEntreprise: string;
  loading?: boolean;
}

export function EmployeList({ employes, idEntreprise, loading }: EmployeListProps) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-[#6B778C]">
        Chargement des employés…
      </div>
    );
  }

  if (employes.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-[#6B778C]">
        Aucun employé enregistré.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#D2DCE8] bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#D2DCE8] bg-[#F6F8FC]">
          <tr>
            <th className="px-4 py-3 font-medium text-[#6B778C]">Nom</th>
            <th className="px-4 py-3 font-medium text-[#6B778C]">Appareil</th>
            <th className="px-4 py-3 font-medium text-[#6B778C]">Code activation</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFF3F8]">
          {employes.map((e) => {
            const codeExpire = e.codeActivationExpireLe
              ? new Date(e.codeActivationExpireLe) < new Date()
              : true;

            return (
              <tr key={e.employeeId} className="hover:bg-[#F6F8FC]">
                <td className="px-4 py-3 font-medium text-[#172B4D]">{e.nomEmployee}</td>

                {/* Appareil */}
                <td className="px-4 py-3">
                  {e.deviceId ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Associé
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-[#EFF3F8] px-2 py-0.5 text-xs text-[#6B778C]">
                      Aucun
                    </span>
                  )}
                </td>

                {/* Code activation */}
                <td className="px-4 py-3">
                  {e.codeActivationExpireLe && !codeExpire ? (
                    <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Code actif
                    </span>
                  ) : (
                    <span className="text-xs text-[#6B778C]">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/entreprises/${idEntreprise}/employes/${e.employeeId}/modifier`}
                      className="text-[#6B778C] hover:text-[#172B4D]"
                    >
                      Modifier
                    </Link>
                    <Link
                      href={`/entreprises/${idEntreprise}/employes/${e.employeeId}`}
                      className="text-[#0052CC] hover:underline"
                    >
                      Voir
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
