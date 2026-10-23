import { httpClient } from "@/lib/http-client";
import type { EmployesApi } from "./index";
import type { Employe, EmployeCreateData, EmployeUpdateData, ActivationCodeResponse } from "../types";

export const httpEmployesApi: EmployesApi = {
  async list(idEntreprise: string) {
    return httpClient<Employe[]>(`/entreprises/${idEntreprise}/employes`);
  },

  async getById(employeeId: string) {
    return httpClient<Employe>(`/employes/${employeeId}`);
  },

  async create(idEntreprise: string, data: EmployeCreateData) {
    return httpClient<Employe>(`/entreprises/${idEntreprise}/employes`, {
      method: "POST",
      body: data,
    });
  },

  async update(employeeId: string, data: EmployeUpdateData) {
    return httpClient<Employe>(`/employes/${employeeId}`, { method: "PUT", body: data });
  },

  async delete(employeeId: string) {
    await httpClient<void>(`/employes/${employeeId}`, { method: "DELETE" });
  },

  async generateActivationCode(employeeId: string): Promise<ActivationCodeResponse> {
    return httpClient<ActivationCodeResponse>(
      `/employes/${employeeId}/code-activation`,
      { method: "POST" },
    );
  },

  async dissocierAppareil(employeeId: string) {
    return httpClient<Employe>(`/employes/${employeeId}/dissocier-appareil`, {
      method: "POST",
    });
  },
};
