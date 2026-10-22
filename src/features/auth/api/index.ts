import { isFakeMode } from "@/lib/api-mode";
import { fakeAuthApi } from "./fake";
import { httpAuthApi } from "./http";

export interface AuthApi {
  login(username: string, password: string): Promise<{ token: string }>;
  logout(): Promise<void>;
  verifyToken(token: string): Promise<boolean>;
}

/** API d'authentification — dispatche vers fake ou http selon API_MODE. */
export const authApi: AuthApi = isFakeMode() ? fakeAuthApi : httpAuthApi;
