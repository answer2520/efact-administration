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
    label: initialData?.label ?? "",
    rights: initialData?.rights ?? [],
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.label.trim()) return;
    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="Libellé du rôle"
        name="label"
        value={formData.label}
        onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
        required
      />

      <PermissionPicker
        selected={formData.rights}
        onChange={(rights) => setFormData((prev) => ({ ...prev, rights }))}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          {initialData ? "Enregistrer" : "Créer le rôle"}
        </Button>
      </div>
    </form>
  );
}
