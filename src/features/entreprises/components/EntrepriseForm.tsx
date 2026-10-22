"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Entreprise, EntrepriseFormData } from "../types";
import { validateEntreprise, EntrepriseValidationErrors } from "../schema";

export interface EntrepriseFormProps {
  initialData?: Entreprise;
  onSubmit: (data: EntrepriseFormData) => Promise<void>;
  submitting?: boolean;
}

const emptyForm: EntrepriseFormData = {
  nif: "",
  nom: "",
  adresse: "",
  telephone: "",
  email: "",
  rccm: "",
  statut: "actif",
};

export function EntrepriseForm({ initialData, onSubmit, submitting }: EntrepriseFormProps) {
  const [formData, setFormData] = useState<EntrepriseFormData>(
    initialData
      ? {
          nif: initialData.nif,
          nom: initialData.nom,
          adresse: initialData.adresse ?? "",
          telephone: initialData.telephone ?? "",
          email: initialData.email ?? "",
          rccm: initialData.rccm ?? "",
          statut: initialData.statut,
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<EntrepriseValidationErrors>({});

  function updateField(field: keyof EntrepriseFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateEntreprise(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="NIF"
          name="nif"
          value={formData.nif}
          onChange={(e) => updateField("nif", e.target.value)}
          error={errors.nif}
          required
        />
        <Input
          label="RCCM"
          name="rccm"
          value={formData.rccm}
          onChange={(e) => updateField("rccm", e.target.value)}
        />
      </div>

      <Input
        label="Nom"
        name="nom"
        value={formData.nom}
        onChange={(e) => updateField("nom", e.target.value)}
        error={errors.nom}
        required
      />

      <Input
        label="Adresse"
        name="adresse"
        value={formData.adresse}
        onChange={(e) => updateField("adresse", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Téléphone"
          name="telephone"
          value={formData.telephone}
          onChange={(e) => updateField("telephone", e.target.value)}
          error={errors.telephone}
        />
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Statut</label>
        <select
          value={formData.statut}
          onChange={(e) => updateField("statut", e.target.value)}
          className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={submitting}>
          {initialData ? "Enregistrer" : "Créer l'entreprise"}
        </Button>
      </div>
    </form>
  );
}
