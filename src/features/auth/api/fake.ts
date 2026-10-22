import { ApiError } from "@/lib/api-error";
import { ensureSeeded, readTable } from "@/lib/fake-db";
import type { AuthApi } from "./index";

interface AdminUser {
  username: string;
  password: string;
}

const ADMIN_KEY = "efact:admins";

function seedAdmins() {
  ensureSeeded(({ set }) => {
    set<AdminUser>(ADMIN_KEY, [
      { username: "admin", password: "admin" },
    ]);
  });
}

function generateFakeToken(username: string): string {
  return btoa(`${username}:${Date.now()}`);
}

export const fakeAuthApi: AuthApi = {
  async login(username: string, password: string) {
    seedAdmins();
    const admins = readTable<AdminUser>(ADMIN_KEY);
    const found = admins.find((a) => a.username === username && a.password === password);
    if (!found) {
      throw new ApiError(401, "AUTH_INVALID_CREDENTIALS", "Identifiants incorrects.");
    }
    return { token: generateFakeToken(username) };
  },

  async logout() {
    // En mode fake, le logout est géré côté client (suppression du token)
  },

  async verifyToken(token: string) {
    // En mode fake, tout token non vide est valide
    return token.length > 0;
  },
};
