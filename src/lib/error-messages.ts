/**
 * Convertit un code d'erreur métier (contrat d'API CLAUDE.md) en message français.
 * Le client se base toujours sur `error.code`, jamais sur le texte du message.
 */
const MESSAGES: Record<string, string> = {
  // Auth
  IDENTIFIANTS_INVALIDES: "Identifiants incorrects. Veuillez réessayer.",
  NON_AUTHENTIFIE: "Votre session a expiré. Veuillez vous reconnecter.",

  // Entreprises
  NIF_DEJA_UTILISE: "Ce NIF est déjà utilisé par une autre entreprise.",
  USERNAME_DEJA_UTILISE: "Ce username OBR est déjà utilisé par une autre entreprise.",

  // Rôles
  ROLE_ADMIN_PROTEGE: "Le rôle Admin par défaut ne peut pas être modifié ni supprimé.",
  ROLE_ATTRIBUE: "Ce rôle est encore attribué à un ou plusieurs employés.",
  PERMISSION_INCONNUE: "Une permission sélectionnée n'existe pas dans le catalogue.",

  // Employés
  ROLE_AUTRE_ENTREPRISE: "Le rôle sélectionné n'appartient pas à cette entreprise.",
  CODE_INVALIDE: "Ce code d'activation est invalide.",
  CODE_EXPIRE: "Ce code d'activation a expiré.",
  CODE_DEJA_UTILISE: "Ce code d'activation a déjà été utilisé.",
  EMPLOYE_AUTRE_ENTREPRISE: "Cet employé n'appartient pas à l'entreprise validée.",
  EMPLOYE_DEJA_ASSOCIE: "Cet employé est déjà associé à un appareil.",
  EMPLOYE_DEVICE_NOT_LINKED: "Aucun appareil n'est associé à cet employé.",

  // Mobile
  ENTREPRISE_NON_ENREGISTREE: "Cette entreprise n'est pas enregistrée sur la plateforme.",

  // Génériques
  INTROUVABLE: "Ressource introuvable.",
  VALIDATION: "Les données saisies sont invalides.",
  INTERNAL_ERROR: "Une erreur inattendue s'est produite. Veuillez réessayer.",
};

export function getErrorMessage(code: string): string {
  return MESSAGES[code] ?? MESSAGES.INTERNAL_ERROR;
}
