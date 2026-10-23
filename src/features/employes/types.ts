/**
 * Modèle de données Employé — conforme au contrat d'API CLAUDE.md.
 *
 * Champs définis dans le contrat :
 *   employeeId, nomEmployee, idEntreprise, roleId,
 *   deviceId, codeActivationExpireLe, codeActivationUtilise
 *
 * Le code d'activation lui-même (codeActivation) n'est renvoyé QUE
 * par l'endpoint POST /employes/{id}/code-activation.
 */
export interface Employe {
  employeeId: string;
  nomEmployee: string;
  idEntreprise: string;
  roleId: string;
  /** Identifiant matériel du téléphone associé. null = aucun appareil. */
  deviceId: string | null;
  /** Date d'expiration du code d'activation (ISO 8601 UTC). null = pas de code généré. */
  codeActivationExpireLe: string | null;
  /** true si le code a déjà été utilisé pour une activation. */
  codeActivationUtilise: boolean;
}

/** Réponse de l'endpoint POST /employes/{id}/code-activation. */
export interface ActivationCodeResponse {
  codeActivation: string;
  expireLe: string; // ISO 8601 UTC
}

/** Données du formulaire de création d'un employé. */
export interface EmployeCreateData {
  nomEmployee: string;
  roleId: string;
}

/** Données du formulaire de modification d'un employé. */
export interface EmployeUpdateData {
  nomEmployee: string;
  roleId: string;
}

/** Durée de validité du code d'activation en millisecondes (3 minutes). */
export const ACTIVATION_CODE_DURATION_MS = 3 * 60 * 1000;
