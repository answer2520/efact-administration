import { isFakeMode } from "@/lib/api-mode";
import { fakeRolesApi } from "./fake";
import { httpRolesApi } from "./http";
import type { Role, RoleFormData } from "../types";

export interface RolesApi {
  /** Liste les rôles d'une entreprise. */
  list(idEntreprise: string): Promise<Role[]>;
  create(idEntreprise: string, data: RoleFormData): Promise<Role>;
  update(id: string, data: RoleFormData): Promise<Role>;
  delete(id: string): Promise<void>;
}

export const rolesApi: RolesApi = isFakeMode() ? fakeRolesApi : httpRolesApi;
