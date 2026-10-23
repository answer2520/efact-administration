import { ApiError } from "@/lib/api-error";
import { ensureSeeded, readTable, insertRow, updateRow, findRow } from "@/lib/fake-db";
import type { EntreprisesApi } from "./index";
import type { Entreprise, EntrepriseCreateData, EntrepriseUpdateData } from "../types";

const TABLE_KEY = "efact:entreprises";

/** Stocke aussi le password chiffré côté fake (en clair pour la démo). */
interface EntrepriseStored extends Entreprise {
  _password: string;
}

function seed() {
  ensureSeeded(({ set }) => {
    set<EntrepriseStored>(TABLE_KEY, [
      {
        idEntreprise: "demo-1",
        nif: "NIF001",
        nomEntreprise: "Démo SARL",
        username: "demo_sarl",
        _password: "secret123",
      },
      {
        idEntreprise: "demo-2",
        nif: "NIF002",
        nomEntreprise: "Transport Mbolé SPRL",
        username: "transport_mbole",
        _password: "secret456",
      },
    ]);
  });
}

/** Supprime le champ interne avant de retourner au client. */
function toPublic(e: EntrepriseStored): Entreprise {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _password, ...pub } = e;
  return pub;
}

export const fakeEntreprisesApi: EntreprisesApi = {
  async list(params?: { search?: string }) {
    seed();
    const rows = readTable<EntrepriseStored>(TABLE_KEY);
    const search = params?.search?.trim().toLowerCase();
    const filtered = search
      ? rows.filter(
          (e) =>
            e.nomEntreprise.toLowerCase().includes(search) ||
            e.nif.toLowerCase().includes(search),
        )
      : rows;
    return filtered.map(toPublic);
  },

  async getById(id: string) {
    seed();
    const row = findRow<EntrepriseStored>(TABLE_KEY, id, "idEntreprise");
    if (!row) throw new ApiError(404, "INTROUVABLE", `Entreprise ${id} introuvable.`);
    return toPublic(row);
  },

  async create(data: EntrepriseCreateData) {
    seed();
    const rows = readTable<EntrepriseStored>(TABLE_KEY);
    if (rows.some((e) => e.nif === data.nif)) {
      throw new ApiError(409, "NIF_DEJA_UTILISE", `Le NIF ${data.nif} est déjà utilisé.`);
    }
    if (rows.some((e) => e.username === data.username)) {
      throw new ApiError(409, "USERNAME_DEJA_UTILISE", `Le username ${data.username} est déjà utilisé.`);
    }
    const stored = insertRow<EntrepriseStored>(
      TABLE_KEY,
      {
        nif: data.nif,
        nomEntreprise: data.nomEntreprise,
        username: data.username,
        _password: data.password,
      },
      "idEntreprise",
    );
    return toPublic(stored);
  },

  async update(id: string, data: EntrepriseUpdateData) {
    seed();
    const existing = findRow<EntrepriseStored>(TABLE_KEY, id, "idEntreprise");
    if (!existing) throw new ApiError(404, "INTROUVABLE", `Entreprise ${id} introuvable.`);
    const rows = readTable<EntrepriseStored>(TABLE_KEY);
    if (rows.some((e) => e.idEntreprise !== id && e.username === data.username)) {
      throw new ApiError(409, "USERNAME_DEJA_UTILISE", `Le username ${data.username} est déjà utilisé.`);
    }
    const patch: Partial<EntrepriseStored> = {
      nomEntreprise: data.nomEntreprise,
      username: data.username,
    };
    if (data.password) patch._password = data.password;
    const updated = updateRow<EntrepriseStored>(TABLE_KEY, id, patch, "idEntreprise");
    return toPublic(updated!);
  },
};
