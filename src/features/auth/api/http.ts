import { httpClient } from "@/lib/http-client";
import type { AuthApi } from "./index";

export const httpAuthApi: AuthApi = {
  async login(username, password) {
    return httpClient<{ token: string }>("/auth/login", {
      method: "POST",
      body: { username, password },
      skipAuth: true,
    });
  },

  async logout() {
    await httpClient<void>("/auth/logout", { method: "POST" });
  },

  async verifyToken(token) {
    try {
      await httpClient<{ valid: boolean }>("/auth/verify", {
        method: "POST",
        body: { token },
        skipAuth: true,
      });
      return true;
    } catch {
      return false;
    }
  },
};
