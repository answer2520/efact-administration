import { httpClient } from "@/lib/http-client";
import type { EntreprisesApi } from "./index";
import type { Entreprise, EntrepriseFormData } from "../types";

export const httpEntreprisesApi: EntreprisesApi = {
  async list(params?: { search?: string }) {
    const query = params?.search ? `?search=${encodeURIComponent(params.search)}` : "";
    return httpClient<Entreprise[]>(`/entreprises${query}`);
  },

  async getById(id: string) {
    return httpClient<Entreprise>(`/entreprises/${id}`);
  },

  async create(data: EntrepriseFormData) {
    return httpClient<Entreprise>("/entreprises", {
      method: "POST",
      body: data,
    });
  },

  async update(id: string, data: EntrepriseFormData) {
    return httpClient<Entreprise>(`/entreprises/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async delete(id: string) {
    await httpClient<void>(`/entreprises/${id}`, { method: "DELETE" });
  },
};
