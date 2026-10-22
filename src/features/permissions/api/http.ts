import { httpClient } from "@/lib/http-client";
import type { PermissionsApi, PermissionCatalogResponse } from "./index";

export const httpPermissionsApi: PermissionsApi = {
  async getPermissions(): Promise<PermissionCatalogResponse> {
    return httpClient<PermissionCatalogResponse>("/permissions", { method: "GET" });
  },
};
