import { ApiError } from "@/lib/api-error";
import { ensureSeeded, readTable, writeTable, insertRow, updateRow, deleteRow, findRow } from "@/lib/fake-db";
import type { EntreprisesApi } from "./index";
import type { Entreprise, EntrepriseFormData } from "../types";

const TABLE_KEY = "efact:entreprises";

function seed() {
  ensureSeeded(({ set }) => {
    const now = new Date().toISOString();
    set<Entreprise>(TABLE_KEY, [
      {
        id: "demo-1",
        nif: "NIF001",
        nom: "Entreprise Démo SARL",
        adresse: "123 Avenue de l'Indépendance, Kinshasa",
        telephone: "+243 81 234 5678",
        email: "contact@demo-sarl.cd",
        rccm: "RCCM-KIN-2024-001",
        statut: "actif",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "demo-2",
        nif: "NIF002",
        nom: "Transport Mbolé SPRL",
        adresse: "456 Boulevard du 30 Juin, Lubumbashi",
        telephone: "+243 99 876 5432",
        email: "info@transport-mbole.cd",
        rccm: "RCCM-LUB-2023-045",
        statut: "actif",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });
}

export const fakeEntreprisesApi: EntreprisesApi = {
  async list(params?: { search?: string }) {
    seed();
    const rows = readTable<Entreprise>(TABLE_KEY);
    const search = params?.search?.trim().toLowerCase();
    if (!search) return rows;
    return rows.filter(
      (e) =>
        e.nom.toLowerCase().includes(search) ||
        e.nif.toLowerCase().includes(search),
    );
  },

  async getById(id: string) {
    seed();
    const row = findRow<Entreprise>(TABLE_KEY, id);
    if (!row) {
      throw new ApiError(404, "ENTREPRISE_NOT_FOUND", `Entreprise ${id} introuvable.`);
    }
    return row;
  },

  async create(data: EntrepriseFormData) {
    seed();
    const rows = readTable<Entreprise>(TABLE_KEY);
    if (rows.some((e) => e.nif === data.nif)) {
      throw new ApiError(409, "ENTREPRISE_NIF_DUPLICATE", `Le NIF ${data.nif} existe déjà.`);
    }
    const now = new Date().toISOString();
    return insertRow<Entreprise>(TABLE_KEY, {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(id: string, data: EntrepriseFormData) {
    seed();
    const existing = findRow<Entreprise>(TABLE_KEY, id);
    if (!existing) {
      throw new ApiError(404, "ENTREPRISE_NOT_FOUND", `Entreprise ${id} introuvable.`);
    }
    const rows = readTable<Entreprise>(TABLE_KEY);
    if (rows.some((e) => e.id !== id && e.nif === data.nif)) {
      throw new ApiError(409, "ENTREPRISE_NIF_DUPLICATE", `Le NIF ${data.nif} existe déjà.`);
    }
    const updated = updateRow<Entreprise>(TABLE_KEY, id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return updated!;
  },

  async delete(id: string) {
    seed();
    const deleted = deleteRow<Entreprise>(TABLE_KEY, id);
    if (!deleted) {
      throw new ApiError(404, "ENTREPRISE_NOT_FOUND", `Entreprise ${id} introuvable.`);
    }
    // Supprimer aussi les employés associés
    const employes = readTable<{ entrepriseId: string }>("efact:employes");
    const remaining = employes.filter((e) => e.entrepriseId !== id);
    writeTable("efact:employes", remaining);
  },
};
