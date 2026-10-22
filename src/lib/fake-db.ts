/**
 * Helper localStorage pour le mode "fake".
 *
 * Fournit une lecture/écriture typée d'une "table" et un mécanisme de seed
 * qui s'exécute une seule fois (flag `efact:seeded`).
 *
 * Attention : ne s'utilise que côté client (localStorage n'existe pas au SSR).
 */

const SEED_FLAG = "efact:seeded";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/** Lit une table depuis localStorage et la désérialise. */
export function readTable<T>(key: string): T[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

/** Écrit une table dans localStorage. */
export function writeTable<T>(key: string, rows: T[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(rows));
}

/** Insère une ligne et la retourne avec un id généré. */
export function insertRow<T extends { id: string }>(
  key: string,
  row: Omit<T, "id">,
): T {
  const rows = readTable<T>(key);
  const id = crypto.randomUUID();
  const newRow = { ...row, id } as T;
  rows.push(newRow);
  writeTable(key, rows);
  return newRow;
}

/** Met à jour une ligne par son id. Retourne la ligne ou `null`. */
export function updateRow<T extends { id: string }>(
  key: string,
  id: string,
  patch: Partial<T>,
): T | null {
  const rows = readTable<T>(key);
  const index = rows.findIndex((r) => r.id === id);
  if (index === -1) return null;
  rows[index] = { ...rows[index], ...patch };
  writeTable(key, rows);
  return rows[index];
}

/** Supprime une ligne par son id. */
export function deleteRow<T extends { id: string }>(key: string, id: string): boolean {
  const rows = readTable<T>(key);
  const filtered = rows.filter((r) => r.id !== id);
  if (filtered.length === rows.length) return false;
  writeTable(key, filtered);
  return true;
}

/** Récupère une ligne par son id. */
export function findRow<T extends { id: string }>(key: string, id: string): T | null {
  const rows = readTable<T>(key);
  return rows.find((r) => r.id === id) ?? null;
}

/**
 * Initialise les données de démonstration une seule fois.
 * La fonction `seed` reçoit des helpers pour écrire chaque table.
 */
export function ensureSeeded(
  seed: (helpers: {
    set: <T>(key: string, rows: T[]) => void;
    isSeeded: boolean;
  }) => void,
): void {
  if (!isBrowser()) return;

  const isSeeded = localStorage.getItem(SEED_FLAG) === "true";
  if (isSeeded) return;

  seed({
    isSeeded: false,
    set: <T>(key: string, rows: T[]) => writeTable(key, rows),
  });

  localStorage.setItem(SEED_FLAG, "true");
}

/** Réinitialise toutes les données fake (utile pour les tests). */
export function resetFakeDb(): void {
  if (!isBrowser()) return;
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("efact:"));
  keys.forEach((k) => localStorage.removeItem(k));
}
