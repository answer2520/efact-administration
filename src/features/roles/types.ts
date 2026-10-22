export interface Role {
  id: string;
  nom: string;
  description?: string;
  /** Clés de permission au format `module:action`, ex. ["entreprises:read"]. */
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormData {
  nom: string;
  description: string;
  permissions: string[];
}
