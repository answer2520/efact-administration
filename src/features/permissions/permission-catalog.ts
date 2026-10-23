/**
 * Catalogue des permissions — source unique de vérité.
 *
 * ⚠️ IDENTIQUE à `kPermissionCatalog` dans l'app mobile eFACT
 *    (lib/features/roles/data/permission_catalog.dart).
 *    Toute modification doit être répercutée dans les DEUX dépôts.
 *
 * Les codes sont exactement ceux du CLAUDE.md :
 *   - S010, S011, S012 (et non S10, S11, S12)
 *   - Il n'existe pas de F04
 */

export interface Permission {
  code: string;
  label: string;
}

export interface PermissionModule {
  module: string;
  permissions: Permission[];
}

export const PERMISSION_CATALOG: PermissionModule[] = [
  {
    module: "Facturation",
    permissions: [
      { code: "F00", label: "Visualiser les factures émises" },
      { code: "F01", label: "Effectuer une facture normale" },
      { code: "F02", label: "Effectuer une facture d'avoir" },
      { code: "F03", label: "Effectuer un remboursement caution" },
      { code: "F05", label: "Imprimer les factures" },
      { code: "F06", label: "Annuler une facture" },
      { code: "F07", label: "Enregistrer un paiement d'une facture émise à crédit" },
      { code: "F08", label: "Visualiser le chiffre d'affaire" },
      { code: "F09", label: "Visualiser les factures de tous les utilisateurs" },
    ],
  },
  {
    module: "Client",
    permissions: [
      { code: "CL01", label: "Enregistrer un client" },
      { code: "CL02", label: "Modifier un client" },
      { code: "CL03", label: "Supprimer un client" },
    ],
  },
  {
    module: "Stock",
    permissions: [
      { code: "S01", label: "Créer un article" },
      { code: "S02", label: "Modifier les informations d'un article" },
      { code: "S03", label: "Suspendre un article" },
      { code: "S04", label: "Créer une unité de mesure d'articles" },
      { code: "S05", label: "Modifier une unité de mesure d'articles" },
      { code: "S06", label: "Supprimer une unité de mesure d'articles" },
      { code: "S07", label: "Créer une catégorie d'articles" },
      { code: "S08", label: "Modifier une catégorie d'articles" },
      { code: "S09", label: "Supprimer une catégorie d'articles" },
      { code: "S010", label: "Enregistrer une entrée en stock" },
      { code: "S011", label: "Enregistrer une sortie de stock" },
      { code: "S012", label: "Effectuer l'inventaire de stock" },
    ],
  },
  {
    module: "Utilisateur",
    permissions: [
      { code: "U01", label: "Créer un utilisateur" },
      { code: "U02", label: "Modifier un utilisateur" },
      { code: "U03", label: "Supprimer un utilisateur" },
    ],
  },
  {
    module: "Role",
    permissions: [
      { code: "R01", label: "Ajouter un role" },
      { code: "R02", label: "Modifier un role" },
      { code: "R03", label: "Supprimer un role" },
    ],
  },
  {
    module: "Paramétrage",
    permissions: [
      { code: "P00", label: "Accès au menu paramètres générales" },
      { code: "P01", label: "Voir et modifier les informations du contribuable" },
      { code: "P02", label: "Accéder aux paramètres de la MFE" },
      { code: "P03", label: "Accéder aux documents de la MFE" },
    ],
  },
  {
    module: "Rapport",
    permissions: [
      { code: "RA01", label: "Visualiser le rapport des factures" },
      { code: "RA02", label: "Visualiser le rapport des sorties stock" },
      { code: "RA03", label: "Visualiser le rapport des entrées stock" },
      { code: "RA04", label: "Visualiser le rapport des inventaires stock" },
      { code: "RA05", label: "Visualiser le rapport de la TVA collectée" },
      { code: "RA06", label: "Visualiser les rapports de tous les utilisateurs" },
    ],
  },
];

/** Tous les codes du catalogue (pour validation). */
export function getAllPermissionCodes(): string[] {
  return PERMISSION_CATALOG.flatMap((m) => m.permissions.map((p) => p.code));
}

/** Récupère les codes d'un module. */
export function getModulePermissionCodes(moduleName: string): string[] {
  const mod = PERMISSION_CATALOG.find((m) => m.module === moduleName);
  if (!mod) return [];
  return mod.permissions.map((p) => p.code);
}
