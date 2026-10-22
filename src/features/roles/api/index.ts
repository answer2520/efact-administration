import { isFakeMode } from "@/lib/api-mode";
import { fakeRolesApi } from "./fake";
import { httpRolesApi } from "./http";
import type { Role, RoleFormData } from "../types";

export interface RolesApi {
  list(): Promise<Role[]>;
  getById(id: string): Promise<Role>;
  create(data: RoleFormData): Promise<Role>;
  update(id: string, data: RoleFormData): Promise<Role>;
  delete(id: string): Promise<void>;
}

/** API des rôles — dispatche vers fake ou http selon API_MODE. */
export const rolesApi: RolesApi = isFakeMode() ? fakeRolesApi : httpRolesApi;
