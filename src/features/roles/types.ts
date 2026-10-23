/**
 * Modèle de données Role — conforme au contrat d'API CLAUDE.md.
 *
 * Champs définis dans le contrat :
 *   id, idEntreprise, label, isDefaultAdminRole, rights
 *
 * Règle de permission (copiée depuis l'app mobile) :
 *   hasPermission(code) =
 *     role != null
 *     ET (role.isDefaultAdminRole == true  OU  code ∈ role.rights)
 *
 * Le rôle Admin (isDefaultAdminRole = true) est protégé :
 * il ne peut être ni modifié ni supprimé.
 */
export interface Role {
  id: string;
  idEntreprise: string;
  label: string;
  /** true uniquement pour le rôle Admin par défaut (protégé). */
  isDefaultAdminRole: boolean;
  /** Codes de permission du catalogue, ex. ["F00", "F01", "CL01"]. */
  rights: string[];
}

/** Données du formulaire de création / modification d'un rôle. */
export interface RoleFormData {
  label: string;
  rights: string[];
}
