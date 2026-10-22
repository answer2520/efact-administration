import { ApiError } from "@/lib/api-error";
import { ensureSeeded, readTable, insertRow, updateRow, deleteRow, findRow } from "@/lib/fake-db";
import type { EmployesApi } from "./index";
import type { Employe, EmployeFormData } from "../types";
import { ACTIVATION_CODE_DURATION_MS } from "../types";

const TABLE_KEY = "efact:employes";

function seed() {
  ensureSeeded(({ set }) => {
    const now = new Date().toISOString();
    set<Employe>(TABLE_KEY, [
      {
        id: "emp-1",
        entrepriseId: "demo-1",
        nom: "Mukendi",
        prenom: "Jean",
        matricule: "EMP001",
        telephone: "+243 81 111 2222",
        email: "jean.mukendi@demo-sarl.cd",
        actif: true,
        activationCode: null,
        activationCodeExpiresAt: null,
        device: {
          model: "Samsung Galaxy A52",
          os: "Android 14",
          registeredAt: now,
          lastSeen: now,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "emp-2",
        entrepriseId: "demo-1",
        nom: "Kabongo",
        prenom: "Marie",
        matricule: "EMP002",
        telephone: "+243 82 333 4444",
        email: "marie.kabongo@demo-sarl.cd",
        actif: true,
        activationCode: null,
        activationCodeExpiresAt: null,
        device: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const fakeEmployesApi: EmployesApi = {
  async list(entrepriseId: string) {
    seed();
    return readTable<Employe>(TABLE_KEY).filter((e) => e.entrepriseId === entrepriseId);
  },

  async getById(entrepriseId: string, employeeId: string) {
    seed();
    const row = findRow<Employe>(TABLE_KEY, employeeId);
    if (!row || row.entrepriseId !== entrepriseId) {
      throw new ApiError(404, "EMPLOYE_NOT_FOUND", `Employé ${employeeId} introuvable.`);
    }
    return row;
  },

  async create(entrepriseId: string, data: EmployeFormData) {
    seed();
    const now = new Date().toISOString();
    return insertRow<Employe>(TABLE_KEY, {
      ...data,
      entrepriseId,
      activationCode: null,
      activationCodeExpiresAt: null,
      device: null,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(entrepriseId: string, employeeId: string, data: EmployeFormData) {
    seed();
    const existing = findRow<Employe>(TABLE_KEY, employeeId);
    if (!existing || existing.entrepriseId !== entrepriseId) {
      throw new ApiError(404, "EMPLOYE_NOT_FOUND", `Employé ${employeeId} introuvable.`);
    }
    const updated = updateRow<Employe>(TABLE_KEY, employeeId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return updated!;
  },

  async delete(entrepriseId: string, employeeId: string) {
    seed();
    const row = findRow<Employe>(TABLE_KEY, employeeId);
    if (!row || row.entrepriseId !== entrepriseId) {
      throw new ApiError(404, "EMPLOYE_NOT_FOUND", `Employé ${employeeId} introuvable.`);
    }
    deleteRow<Employe>(TABLE_KEY, employeeId);
  },

  async generateActivationCode(entrepriseId: string, employeeId: string) {
    seed();
    const row = findRow<Employe>(TABLE_KEY, employeeId);
    if (!row || row.entrepriseId !== entrepriseId) {
      throw new ApiError(404, "EMPLOYE_NOT_FOUND", `Employé ${employeeId} introuvable.`);
    }
    if (row.device) {
      throw new ApiError(409, "EMPLOYE_DEVICE_ALREADY_LINKED", "Un appareil est déjà associé.");
    }
    const code = generateCode();
    const expiresAt = new Date(Date.now() + ACTIVATION_CODE_DURATION_MS).toISOString();
    updateRow<Employe>(TABLE_KEY, employeeId, {
      activationCode: code,
      activationCodeExpiresAt: expiresAt,
    });
    return { code, expiresAt };
  },

  async unlinkDevice(entrepriseId: string, employeeId: string) {
    seed();
    const row = findRow<Employe>(TABLE_KEY, employeeId);
    if (!row || row.entrepriseId !== entrepriseId) {
      throw new ApiError(404, "EMPLOYE_NOT_FOUND", `Employé ${employeeId} introuvable.`);
    }
    if (!row.device) {
      throw new ApiError(409, "EMPLOYE_DEVICE_NOT_LINKED", "Aucun appareil associé.");
    }
    const updated = updateRow<Employe>(TABLE_KEY, employeeId, {
      device: null,
      updatedAt: new Date().toISOString(),
    });
    return updated!;
  },
};
