import { isFakeMode } from "@/lib/api-mode";
import { fakeEntreprisesApi } from "./fake";
import { httpEntreprisesApi } from "./http";
import type { Entreprise, EntrepriseCreateData, EntrepriseUpdateData } from "../types";

export interface EntreprisesApi {
  list(params?: { search?: string }): Promise<Entreprise[]>;
  getById(id: string): Promise<Entreprise>;
  create(data: EntrepriseCreateData): Promise<Entreprise>;
  update(id: string, data: EntrepriseUpdateData): Promise<Entreprise>;
}

export const entreprisesApi: EntreprisesApi = isFakeMode()
  ? fakeEntreprisesApi
  : httpEntreprisesApi;
