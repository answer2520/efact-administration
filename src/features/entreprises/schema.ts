import type { EntrepriseCreateData, EntrepriseUpdateData } from "./types";

export interface EntrepriseCreateErrors {
  nif?: string;
  nomEntreprise?: string;
  username?: string;
  password?: string;
}

export interface EntrepriseUpdateErrors {
  nomEntreprise?: string;
  username?: string;
}

export function validateEntrepriseCreate(data: EntrepriseCreateData): EntrepriseCreateErrors {
  const errors: EntrepriseCreateErrors = {};
  if (!data.nif.trim()) errors.nif = "Le NIF est obligatoire.";
  if (!data.nomEntreprise.trim()) errors.nomEntreprise = "Le nom est obligatoire.";
  if (!data.username.trim()) errors.username = "Le username OBR est obligatoire.";
  if (!data.password.trim()) errors.password = "Le mot de passe OBR est obligatoire.";
  return errors;
}

export function validateEntrepriseUpdate(data: EntrepriseUpdateData): EntrepriseUpdateErrors {
  const errors: EntrepriseUpdateErrors = {};
  if (!data.nomEntreprise.trim()) errors.nomEntreprise = "Le nom est obligatoire.";
  if (!data.username.trim()) errors.username = "Le username OBR est obligatoire.";
  return errors;
}
