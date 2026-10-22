import type { EntrepriseFormData } from "./types";

export interface EntrepriseValidationErrors {
  nif?: string;
  nom?: string;
  email?: string;
  telephone?: string;
}

/**
 * Validation du formulaire entreprise.
 * Retourne un objet d'erreurs (vide si tout est valide).
 */
export function validateEntreprise(
  data: EntrepriseFormData,
): EntrepriseValidationErrors {
  const errors: EntrepriseValidationErrors = {};

  if (!data.nif.trim()) {
    errors.nif = "Le NIF est obligatoire.";
  } else if (data.nif.length < 3) {
    errors.nif = "Le NIF doit contenir au moins 3 caractères.";
  }

  if (!data.nom.trim()) {
    errors.nom = "Le nom est obligatoire.";
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "L'adresse e-mail n'est pas valide.";
  }

  if (
    data.telephone &&
    data.telephone.length < 8
  ) {
    errors.telephone = "Le numéro de téléphone n'est pas valide.";
  }

  return errors;
}

/** Vérifie si les données sont valides. */
export function isValidEntreprise(data: EntrepriseFormData): boolean {
  return Object.keys(validateEntreprise(data)).length === 0;
}
