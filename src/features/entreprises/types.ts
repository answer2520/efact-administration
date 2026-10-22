export type EntrepriseStatut = "actif" | "inactif";

export interface Entreprise {
  id: string;
  nif: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  rccm?: string;
  statut: EntrepriseStatut;
  createdAt: string;
  updatedAt: string;
}

/** Données saisies dans le formulaire (avant validation/transformation). */
export interface EntrepriseFormData {
  nif: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  rccm: string;
  statut: EntrepriseStatut;
}
