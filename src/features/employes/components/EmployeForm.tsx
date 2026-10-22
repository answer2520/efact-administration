"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Employe, EmployeFormData } from "../types";

export interface EmployeFormProps {
  initialData?: Employe;
  onSubmit: (data: EmployeFormData) => Promise<void>;
  submitting?: boolean;
}

const emptyForm: EmployeFormData = {
  nom: "",
  prenom: "",
  matricule: "",
  telephone: "",
  email: "",
  actif: true,
};

export function EmployeForm({ initialData, onSubmit, submitting }: EmployeFormProps) {
  const [formData, setFormData] = useState<EmployeFormData>(
    initialData
      ? {
          nom: initialData.nom,
          prenom: initialData.prenom,
          matricule: initialData.matricule,
          telephone: initialData.telephone ?? "",
          email: initialData.email ?? "",
          actif: initialData.actif,
        }
      : emptyForm,
  );

  function updateField(field: keyof EmployeFormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.matricule.trim()) return;
    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={(e) => updateField("prenom", e.target.value)}
        />
        <Input
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={(e) => updateField("nom", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Matricule"
          name="matricule"
          value={formData.matricule}
          onChange={(e) => updateField("matricule", e.target.value)}
          required
        />
        <Input
          label="Téléphone"
          name="telephone"
          value={formData.telephone}
          onChange={(e) => updateField("telephone", e.target.value)}
        />
      </div>

      <Input
        label="E-mail"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => updateField("email", e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={formData.actif}
          onChange={(e) => updateField("actif", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Employé actif
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          {initialData ? "Enregistrer" : "Créer l'employé"}
        </Button>
      </div>
    </form>
  );
}
