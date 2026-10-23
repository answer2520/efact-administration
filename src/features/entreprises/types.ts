/**
 * Modèle de données Entreprise — conforme au contrat d'API CLAUDE.md.
 *
 * Champs définis dans le contrat :
 *   idEntreprise, nif, nomEntreprise, username
 *
 * Le champ `password` (identifiants OBR) n'est JAMAIS renvoyé par l'API
 * d'administration et n'apparaît donc pas dans ce type. Il est uniquement
 * présent dans les FormData de création/modification.
 */
export interface Entreprise {
  idEntreprise: string;
  nif: string;
  nomEntreprise: string;
  /** Identifiant OBR (eBMS) — unique, sert à l'app mobile, pas à la connexion plateforme. */
  username: string;
}

/** Données du formulaire de création. */
export interface EntrepriseCreateData {
  nif: string;
  nomEntreprise: string;
  username: string;
  /** Mot de passe OBR (eBMS) — chiffré en base, jamais renvoyé par l'API. */
  password: string;
}

/**
 * Données du formulaire de modification.
 * `password` absent = inchangé (ne pas envoyer le champ, pas une chaîne vide).
 */
export interface EntrepriseUpdateData {
  nomEntreprise: string;
  username: string;
  password?: string;
}
