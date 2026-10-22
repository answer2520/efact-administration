/**
 * Convertit un code d'erreur métier en message lisible en français.
 *
 * Catalogue central : une seule source de vérité pour le texte affiché
 * à l'utilisateur, quel que soit le mode (fake ou http).
 */
const MESSAGES: Record<string, string> = {
  // --- Auth ---
  AUTH_INVALID_CREDENTIALS: "Identifiants incorrects. Veuillez réessayer.",
  AUTH_TOKEN_EXPIRED: "Votre session a expiré. Veuillez vous reconnecter.",
  AUTH_UNAUTHORIZED: "Vous n'êtes pas autorisé à effectuer cette action.",

  // --- Entreprises ---
  ENTREPRISE_NOT_FOUND: "Entreprise introuvable.",
  ENTREPRISE_NIF_DUPLICATE: "Une entreprise avec ce NIF existe déjà.",
  ENTREPRISE_VALIDATION_ERROR: "Les informations saisies sont invalides.",

  // --- Rôles ---
  ROLE_NOT_FOUND: "Rôle introuvable.",
  ROLE_NAME_DUPLICATE: "Un rôle avec ce nom existe déjà.",

  // --- Employés ---
  EMPLOYE_NOT_FOUND: "Employé introuvable.",
  EMPLOYE_ACTIVATION_CODE_UNAVAILABLE: "Le code d'activation n'est pas disponible.",
  EMPLOYE_DEVICE_NOT_LINKED: "Aucun appareil n'est associé à cet employé.",
  EMPLOYE_DEVICE_ALREADY_LINKED: "Un appareil est déjà associé à cet employé.",

  // --- Permissions ---
  PERMISSIONS_NOT_FOUND: "Permissions introuvables.",

  // --- Génériques ---
  NETWORK_ERROR: "Erreur réseau. Vérifiez votre connexion internet.",
  INTERNAL_ERROR: "Une erreur inattendue s'est produite. Veuillez réessayer.",
  VALIDATION_ERROR: "Les données saisies sont invalides.",
  NOT_FOUND: "Ressource introuvable.",
};

export function getErrorMessage(code: string): string {
  return MESSAGES[code] ?? MESSAGES.INTERNAL_ERROR;
}
