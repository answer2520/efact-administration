"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Entreprise, EntrepriseCreateData, EntrepriseUpdateData } from "../types";
import {
  validateEntrepriseCreate,
  validateEntrepriseUpdate,
  EntrepriseCreateErrors,
  EntrepriseUpdateErrors,
} from "../schema";

/* ---- mode création ---- */
interface CreateProps {
  mode: "create";
  onSubmit: (data: EntrepriseCreateData) => Promise<void>;
  submitting?: boolean;
}

/* ---- mode modification ---- */
interface EditProps {
  mode: "edit";
  initialData: Entreprise;
  onSubmit: (data: EntrepriseUpdateData) => Promise<void>;
  submitting?: boolean;
}

export type EntrepriseFormProps = CreateProps | EditProps;

export function EntrepriseForm(props: EntrepriseFormProps) {
  const isEdit = props.mode === "edit";

  const [nif, setNif] = useState(isEdit ? (props as EditProps).initialData.nif : "");
  const [nomEntreprise, setNomEntreprise] = useState(
    isEdit ? (props as EditProps).initialData.nomEntreprise : "",
  );
  const [username, setUsername] = useState(
    isEdit ? (props as EditProps).initialData.username : "",
  );
  // En mode édition, password vide = inchangé
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<EntrepriseCreateErrors & EntrepriseUpdateErrors>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isEdit) {
      const data: EntrepriseCreateData = { nif, nomEntreprise, username, password };
      const errs = validateEntrepriseCreate(data);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      await (props as CreateProps).onSubmit(data);
    } else {
      const data: EntrepriseUpdateData = {
        nomEntreprise,
        username,
        ...(password ? { password } : {}),
      };
      const errs = validateEntrepriseUpdate(data);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      await (props as EditProps).onSubmit(data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* NIF non modifiable en édition */}
      <Input
        label="NIF"
        name="nif"
        value={nif}
        onChange={(e) => setNif(e.target.value)}
        error={errors.nif}
        required={!isEdit}
        disabled={isEdit}
      />

      <Input
        label="Nom de l'entreprise"
        name="nomEntreprise"
        value={nomEntreprise}
        onChange={(e) => setNomEntreprise(e.target.value)}
        error={errors.nomEntreprise}
        required
      />

      <Input
        label="Username OBR (eBMS)"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username}
        required
      />

      <Input
        label={isEdit ? "Mot de passe OBR (laisser vide = inchangé)" : "Mot de passe OBR (eBMS)"}
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required={!isEdit}
        autoComplete="new-password"
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={props.submitting}>
          {isEdit ? "Enregistrer" : "Créer l'entreprise"}
        </Button>
      </div>
    </form>
  );
}
