/**
 * Gestion du token d'authentification côté client (localStorage).
 *
 * `getAuthToken` est également utilisé par `http-client.ts` pour injecter
 * le Bearer token dans chaque requête HTTP.
 */

const TOKEN_KEY = "efact:token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
