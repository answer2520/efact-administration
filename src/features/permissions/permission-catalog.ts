/**
 * Catalogue des permissions — source unique de vérité.
 *
 * Identique à l'app mobile : tout changement ici doit être répercuté
 * côté mobile. Chaque module expose un ensemble d'actions (CRUD + actions
 * spécifiques). La clé d'une permission est `module:action`.
 */

export interface PermissionAction {
  key: string; // ex. "create"
  label: string; // ex. "Créer"
}

export interface PermissionModule {
  key: string; // ex. "entreprises"
  label: string; // ex. "Entreprises"
  actions: PermissionAction[];
}

/** Actions CRUD standard, réutilisables par plusieurs modules. */
const CRUD_ACTIONS: PermissionAction[] = [
  { key: "read", label: "Consulter" },
  { key: "create", label: "Créer" },
  { key: "update", label: "Modifier" },
  { key: "delete", label: "Supprimer" },
];

export const PERMISSION_CATALOG: PermissionModule[] = [
  {
    key: "entreprises",
    label: "Entreprises",
    actions: CRUD_ACTIONS,
  },
  {
    key: "roles",
    label: "Rôles",
    actions: CRUD_ACTIONS,
  },
  {
    key: "employes",
    label: "Employés",
    actions: [
      ...CRUD_ACTIONS,
      { key: "generate-activation-code", label: "Générer un code d'activation" },
      { key: "unlink-device", label: "Dissocier un appareil" },
    ],
  },
];

/** Aplatit le catalogue en liste de clés `module:action`. */
export function getAllPermissionKeys(): string[] {
  return PERMISSION_CATALOG.flatMap((m) => m.actions.map((a) => `${m.key}:${a.key}`));
}

/** Récupère les clés d'un module. */
export function getModulePermissionKeys(moduleKey: string): string[] {
  const mod = PERMISSION_CATALOG.find((m) => m.key === moduleKey);
  if (!mod) return [];
  return mod.actions.map((a) => `${mod.key}:${a.key}`);
}
