"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Employe, EmployeCreateData, EmployeUpdateData } from "../types";
import type { Role } from "@/features/roles/types";

export interface EmployeFormProps {
  initialData?: Employe;
  /** Rôles disponibles pour cette entreprise. */
  roles: Role[];
  onSubmit: (data: EmployeCreateData | EmployeUpdateData) => Promise<void>;
  submitting?: boolean;
}

export function EmployeForm({ initialData, roles, onSubmit, submitting }: EmployeFormProps) {
  const [nomEmployee, setNomEmployee] = useState(initialData?.nomEmployee ?? "");
  const [roleId, setRoleId] = useState(initialData?.roleId ?? "");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nomEmployee.trim() || !roleId) return;
    await onSubmit({ nomEmployee, roleId });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nom de l'employé"
        name="nomEmployee"
        value={nomEmployee}
        onChange={(e) => setNomEmployee(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="roleId" className="text-sm font-medium text-gray-700">
          Rôle
        </label>
        <select
          id="roleId"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          required
          className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="">— Choisir un rôle —</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting}>
          {initialData ? "Enregistrer" : "Créer l'employé"}
        </Button>
      </div>
    </form>
  );
}
