export interface Device {
  model?: string;
  os?: string;
  registeredAt: string;
  lastSeen?: string;
}

export interface Employe {
  id: string;
  entrepriseId: string;
  nom: string;
  prenom: string;
  matricule: string;
  telephone?: string;
  email?: string;
  actif: boolean;
  /** Code d'activation à 6 chiffres, expirant après 3 minutes. */
  activationCode?: string | null;
  /** ISO date — date d'expiration du code d'activation. */
  activationCodeExpiresAt?: string | null;
  /** Appareil associé (null si aucun). */
  device?: Device | null;
  roleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeFormData {
  nom: string;
  prenom: string;
  matricule: string;
  telephone: string;
  email: string;
  actif: boolean;
  roleId?: string;
}

/** Durée de validité du code d'activation en millisecondes. */
export const ACTIVATION_CODE_DURATION_MS = 3 * 60 * 1000; // 3 minutes
