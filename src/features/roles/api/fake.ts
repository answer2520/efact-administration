import { ApiError } from "@/lib/api-error";
import { getAllPermissionCodes } from "@/features/permissions/permission-catalog";
import { readTable, insertRow, updateRow, deleteRow, findRow } from "@/lib/fake-db";
import type { RolesApi } from "./index";
import type { Role, RoleFormData } from "../types";

const TABLE_KEY = "efact:roles";
const ID_KEY: keyof Role = "id";

function ensureAdminRole(idEntreprise: string): void {
  const rows = readTable<Role>(TABLE_KEY);
  const hasAdmin = rows.some((r) => r.idEntreprise === idEntreprise && r.isDefaultAdminRole);
  if (!hasAdmin) {
    insertRow<Role>(TABLE_KEY, { idEntreprise, label: "Admin", isDefaultAdminRole: true, rights: [] }, ID_KEY);
  }
}

function validateRights(rights: string[]): void {
  const validCodes = new Set(getAllPermissionCodes());
  const unknown = rights.find((c) => !validCodes.has(c));
  if (unknown) throw new ApiError(400, "PERMISSION_INCONNUE", `Permission inconnue : ${unknown}`);
}

export const fakeRolesApi: RolesApi = {
  async list(idEntreprise: string) {
    ensureAdminRole(idEntreprise);
    return readTable<Role>(TABLE_KEY).filter((r) => r.idEntreprise === idEntreprise);
  },

  async create(idEntreprise: string, data: RoleFormData) {
    ensureAdminRole(idEntreprise);
    validateRights(data.rights);
    return insertRow<Role>(TABLE_KEY, {
      idEntreprise,
      label: data.label,
      isDefaultAdminRole: false,
      rights: data.rights,
    }, ID_KEY);
  },

  async update(id: string, data: RoleFormData) {
    const row = findRow<Role>(TABLE_KEY, id, ID_KEY);
    if (!row) throw new ApiError(404, "INTROUVABLE", `Rôle ${id} introuvable.`);
    if (row.isDefaultAdminRole) {
      throw new ApiError(403, "ROLE_ADMIN_PROTEGE", "Le rôle Admin par défaut ne peut pas être modifié.");
    }
    validateRights(data.rights);
    const updated = updateRow<Role>(TABLE_KEY, id, { label: data.label, rights: data.rights }, ID_KEY);
    return updated!;
  },

  async delete(id: string) {
    const row = findRow<Role>(TABLE_KEY, id, ID_KEY);
    if (!row) throw new ApiError(404, "INTROUVABLE", `Rôle ${id} introuvable.`);
    if (row.isDefaultAdminRole) {
      throw new ApiError(403, "ROLE_ADMIN_PROTEGE", "Le rôle Admin par défaut ne peut pas être supprimé.");
    }
    const employes = readTable<{ roleId: string }>("efact:employes");
    if (employes.some((e) => e.roleId === id)) {
      throw new ApiError(409, "ROLE_ATTRIBUE", "Ce rôle est encore attribué à un ou plusieurs employés.");
    }
    deleteRow<Role>(TABLE_KEY, id, ID_KEY);
  },
};
