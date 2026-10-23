import { ApiError } from "@/lib/api-error";
import { readTable, insertRow, updateRow, deleteRow, findRow } from "@/lib/fake-db";
import type { EmployesApi } from "./index";
import type { Employe, EmployeCreateData, EmployeUpdateData, ActivationCodeResponse } from "../types";
import { ACTIVATION_CODE_DURATION_MS } from "../types";

const TABLE_KEY = "efact:employes";
const ID_KEY: keyof Employe = "employeeId";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const fakeEmployesApi: EmployesApi = {
  async list(idEntreprise: string) {
    return readTable<Employe>(TABLE_KEY).filter((e) => e.idEntreprise === idEntreprise);
  },

  async getById(employeeId: string) {
    const row = findRow<Employe>(TABLE_KEY, employeeId, ID_KEY);
    if (!row) throw new ApiError(404, "INTROUVABLE", `Employé ${employeeId} introuvable.`);
    return row;
  },

  async create(idEntreprise: string, data: EmployeCreateData) {
    return insertRow<Employe>(TABLE_KEY, {
      idEntreprise,
      nomEmployee: data.nomEmployee,
      roleId: data.roleId,
      deviceId: null,
      codeActivationExpireLe: null,
      codeActivationUtilise: false,
    }, ID_KEY);
  },

  async update(employeeId: string, data: EmployeUpdateData) {
    const row = findRow<Employe>(TABLE_KEY, employeeId, ID_KEY);
    if (!row) throw new ApiError(404, "INTROUVABLE", `Employé ${employeeId} introuvable.`);
    const updated = updateRow<Employe>(
      TABLE_KEY,
      employeeId,
      { nomEmployee: data.nomEmployee, roleId: data.roleId },
      ID_KEY,
    );
    return updated!;
  },

  async delete(employeeId: string) {
    const row = findRow<Employe>(TABLE_KEY, employeeId, ID_KEY);
    if (!row) throw new ApiError(404, "INTROUVABLE", `Employé ${employeeId} introuvable.`);
    deleteRow<Employe>(TABLE_KEY, employeeId, ID_KEY);
  },

  async generateActivationCode(employeeId: string): Promise<ActivationCodeResponse> {
    const row = findRow<Employe>(TABLE_KEY, employeeId, ID_KEY);
    if (!row) throw new ApiError(404, "INTROUVABLE", `Employé ${employeeId} introuvable.`);
    const codeActivation = generateCode();
    const expireLe = new Date(Date.now() + ACTIVATION_CODE_DURATION_MS).toISOString();
    updateRow<Employe>(TABLE_KEY, employeeId, {
      codeActivationExpireLe: expireLe,
      codeActivationUtilise: false,
    }, ID_KEY);
    return { codeActivation, expireLe };
  },

  async dissocierAppareil(employeeId: string) {
    const row = findRow<Employe>(TABLE_KEY, employeeId, ID_KEY);
    if (!row) throw new ApiError(404, "INTROUVABLE", `Employé ${employeeId} introuvable.`);
    if (!row.deviceId) {
      throw new ApiError(409, "EMPLOYE_DEVICE_NOT_LINKED", "Aucun appareil associé.");
    }
    const updated = updateRow<Employe>(TABLE_KEY, employeeId, { deviceId: null }, ID_KEY);
    return updated!;
  },
};
