import { PERMISSION_CATALOG } from "../permission-catalog";
import type { PermissionsApi, PermissionCatalogResponse } from "./index";

export const fakePermissionsApi: PermissionsApi = {
  async getPermissions(): Promise<PermissionCatalogResponse> {
    return {
      modules: PERMISSION_CATALOG.map((m) => ({
        key: m.key,
        label: m.label,
        actions: m.actions,
      })),
    };
  },
};
