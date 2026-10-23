import { PERMISSION_CATALOG } from "../permission-catalog";
import type { PermissionsApi, PermissionCatalogResponse } from "./index";

export const fakePermissionsApi: PermissionsApi = {
  async getPermissions(): Promise<PermissionCatalogResponse> {
    return {
      modules: PERMISSION_CATALOG.map((m) => ({
        module: m.module,
        permissions: m.permissions,
      })),
    };
  },
};
