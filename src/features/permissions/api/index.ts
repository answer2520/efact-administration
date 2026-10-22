import { isFakeMode } from "@/lib/api-mode";
import { fakePermissionsApi } from "./fake";
import { httpPermissionsApi } from "./http";

export interface PermissionsApi {
  /** Récupère le catalogue des permissions disponibles. */
  getPermissions(): Promise<PermissionCatalogResponse>;
}

export interface PermissionCatalogResponse {
  modules: {
    key: string;
    label: string;
    actions: { key: string; label: string }[];
  }[];
}

/** API des permissions — dispatche vers fake ou http selon API_MODE. */
export const permissionsApi: PermissionsApi = isFakeMode()
  ? fakePermissionsApi
  : httpPermissionsApi;
