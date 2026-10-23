import { httpClient } from "@/lib/http-client";
import type { RolesApi } from "./index";
import type { Role, RoleFormData } from "../types";

export const httpRolesApi: RolesApi = {
  async list(idEntreprise: string) {
    return httpClient<Role[]>(`/entreprises/${idEntreprise}/roles`);
  },

  async create(idEntreprise: string, data: RoleFormData) {
    return httpClient<Role>(`/entreprises/${idEntreprise}/roles`, {
      method: "POST",
      body: data,
    });
  },

  async update(id: string, data: RoleFormData) {
    return httpClient<Role>(`/roles/${id}`, { method: "PUT", body: data });
  },

  async delete(id: string) {
    await httpClient<void>(`/roles/${id}`, { method: "DELETE" });
  },
};
