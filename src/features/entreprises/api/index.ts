import { isFakeMode } from "@/lib/api-mode";
import { fakeEntreprisesApi } from "./fake";
import { httpEntreprisesApi } from "./http";
import type { Entreprise, EntrepriseFormData } from "../types";

export interface EntreprisesApi {
  list(params?: { search?: string }): Promise<Entreprise[]>;
  getById(id: string): Promise<Entreprise>;
  create(data: EntrepriseFormData): Promise<Entreprise>;
  update(id: string, data: EntrepriseFormData): Promise<Entreprise>;
  delete(id: string): Promise<void>;
}

/** API des entreprises — dispatche vers fake ou http selon API_MODE. */
export const entreprisesApi: EntreprisesApi = isFakeMode()
  ? fakeEntreprisesApi
  : httpEntreprisesApi;
