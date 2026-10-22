/**
 * Détermine le mode d'exécution de l'API.
 *
 * - "fake" : utilise les implémentations en localStorage (développement hors-ligne)
 * - "http" : appelle l'API REST distante via http-client
 *
 * La valeur est lue depuis la variable d'environnement `API_MODE`.
 */
export type ApiMode = "fake" | "http";

export function getApiMode(): ApiMode {
  const raw = process.env.API_MODE ?? "fake";
  return raw === "http" ? "http" : "fake";
}

export function isFakeMode(): boolean {
  return getApiMode() === "fake";
}

export function isHttpMode(): boolean {
  return getApiMode() === "http";
}
