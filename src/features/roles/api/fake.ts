import { ApiError } from "@/lib/api-error";
import { ensureSeeded, readTable, insertRow, updateRow, deleteRow, findRow } from "@/lib/fake-db";
import type { RolesApi } from "./index";
import type { Role, RoleFormData } from "../types";

const TABLE_KEY = "efact:roles";

function seed() {
  ensureSeeded(({ set }) => {
    const now = new Date().toISOString();
    set<Role>(TABLE_KEY, [
      {
        id: "role-admin",
        nom: "Administrateur",
        description: "Accès complet à tous les modules",
        permissions: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "role-gestionnaire",
        nom: "Gestionnaire",
        description: "Gestion des entreprises et employés",
        permissions: ["entreprises:read", "entreprises:create", "employes:read", "employes:create"],
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });
}

export const fakeRolesApi: RolesApi = {
  async list() {
    seed();
    return readTable<Role>(TABLE_KEY);
  },

  async getById(id: string) {
    seed();
    const row = findRow<Role>(TABLE_KEY, id);
    if (!row) {
      throw new ApiError(404, "ROLE_NOT_FOUND", `Rôle ${id} introuvable.`);
    }
    return row;
  },

  async create(data: RoleFormData) {
    seed();
    const rows = readTable<Role>(TABLE_KEY);
    if (rows.some((r) => r.nom.toLowerCase() === data.nom.toLowerCase())) {
      throw new ApiError(409, "ROLE_NAME_DUPLICATE", `Le nom ${data.nom} existe déjà.`);
    }
    const now = new Date().toISOString();
    return insertRow<Role>(TABLE_KEY, {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(id: string, data: RoleFormData) {
    seed();
    const existing = findRow<Role>(TABLE_KEY, id);
    if (!existing) {
      throw new ApiError(404, "ROLE_NOT_FOUND", `Rôle ${id} introuvable.`);
    }
    const rows = readTable<Role>(TABLE_KEY);
    if (rows.some((r) => r.id !== id && r.nom.toLowerCase() === data.nom.toLowerCase())) {
      throw new ApiError(409, "ROLE_NAME_DUPLICATE", `Le nom ${data.nom} existe déjà.`);
    }
    const updated = updateRow<Role>(TABLE_KEY, id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return updated!;
  },

  async delete(id: string) {
    seed();
    const deleted = deleteRow<Role>(TABLE_KEY, id);
    if (!deleted) {
      throw new ApiError(404, "ROLE_NOT_FOUND", `Rôle ${id} introuvable.`);
    }
  },
};
