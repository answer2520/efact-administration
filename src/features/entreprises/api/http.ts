import { httpClient } from "@/lib/http-client";
import type { EntreprisesApi } from "./index";
import type { Entreprise, EntrepriseCreateData, EntrepriseUpdateData } from "../types";

export const httpEntreprisesApi: EntreprisesApi = {
  async list(params?: { search?: string }) {
    const query = params?.search ? `?search=${encodeURIComponent(params.search)}` : "";
    return httpClient<Entreprise[]>(`/entreprises${query}`);
  },

  async getById(id: string) {
    return httpClient<Entreprise>(`/entreprises/${id}`);
  },

  async create(data: EntrepriseCreateData) {
    return httpClient<Entreprise>("/entreprises", { method: "POST", body: data });
  },

  async update(id: string, data: EntrepriseUpdateData) {
    // password absent = inchangé (on n'envoie pas le champ)
    const body: Record<string, string> = {
      nomEntreprise: data.nomEntreprise,
      username: data.username,
    };
    if (data.password) body.password = data.password;
    return httpClient<Entreprise>(`/entreprises/${id}`, { method: "PUT", body });
  },
};
