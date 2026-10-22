"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PermissionPicker } from "@/features/permissions/PermissionPicker";
import type { Role, RoleFormData } from "../types";

export interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormData) => Promise<void>;
  submitting?: boolean;
}

export function RoleForm({ initialData, onSubmit, submitting }: RoleFormProps) {
  const [formData, setFormData] = useState<RoleFormData>({
    nom: initialData?.nom ?? "",
    description: initialData?.description ?? "",
    permissions: initialData?.permissions ?? [],
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.nom.trim()) return;
    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="Nom du rôle"
        name="nom"
        value={formData.nom}
        onChange={(e) => setFormData((prev) => ({ ...prev, nom: e.target.value }))}
        required
      />

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
      />

      <PermissionPicker
        selected={formData.permissions}
        onChange={(permissions) => setFormData((prev) => ({ ...prev, permissions }))}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          {initialData ? "Enregistrer" : "Créer le rôle"}
        </Button>
      </div>
    </form>
  );
}
