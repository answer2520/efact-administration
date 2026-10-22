import { httpClient } from "@/lib/http-client";
import type { EmployesApi } from "./index";
import type { Employe, EmployeFormData } from "../types";

export const httpEmployesApi: EmployesApi = {
  async list(entrepriseId: string) {
    return httpClient<Employe[]>(`/entreprises/${entrepriseId}/employes`);
  },

  async getById(entrepriseId: string, employeeId: string) {
    return httpClient<Employe>(`/entreprises/${entrepriseId}/employes/${employeeId}`);
  },

  async create(entrepriseId: string, data: EmployeFormData) {
    return httpClient<Employe>(`/entreprises/${entrepriseId}/employes`, {
      method: "POST",
      body: data,
    });
  },

  async update(entrepriseId: string, employeeId: string, data: EmployeFormData) {
    return httpClient<Employe>(`/entreprises/${entrepriseId}/employes/${employeeId}`, {
      method: "PUT",
      body: data,
    });
  },

  async delete(entrepriseId: string, employeeId: string) {
    await httpClient<void>(`/entreprises/${entrepriseId}/employes/${employeeId}`, {
      method: "DELETE",
    });
  },

  async generateActivationCode(entrepriseId: string, employeeId: string) {
    return httpClient<{ code: string; expiresAt: string }>(
      `/entreprises/${entrepriseId}/employes/${employeeId}/activation-code`,
      { method: "POST" },
    );
  },

  async unlinkDevice(entrepriseId: string, employeeId: string) {
    return httpClient<Employe>(
      `/entreprises/${entrepriseId}/employes/${employeeId}/device`,
      { method: "DELETE" },
    );
  },
};
