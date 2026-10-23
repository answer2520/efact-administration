import { isFakeMode } from "@/lib/api-mode";
import { fakePermissionsApi } from "./fake";
import { httpPermissionsApi } from "./http";
import type { PermissionModule } from "../permission-catalog";

export interface PermissionsApi {
  getPermissions(): Promise<PermissionCatalogResponse>;
}

export interface PermissionCatalogResponse {
  modules: PermissionModule[];
}

export const permissionsApi: PermissionsApi = isFakeMode()
  ? fakePermissionsApi
  : httpPermissionsApi;
