/**
 * Helper localStorage pour le mode "fake".
 *
 * Les helpers acceptent un paramètre `idKey` (défaut : "id") pour s'adapter
 * aux modèles dont la clé primaire n'est pas `id`
 * (ex. `idEntreprise`, `employeeId`).
 */

const SEED_FLAG = "efact:seeded";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

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

export function writeTable<T>(key: string, rows: T[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(rows));
}

/** Insère une ligne en générant un UUID pour la clé primaire indiquée. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function insertRow<T>(key: string, row: Record<string, any>, idKey: keyof T = "id" as keyof T): T {
  const rows = readTable<T>(key);
  const newRow = { ...row, [idKey]: crypto.randomUUID() } as T;
  rows.push(newRow);
  writeTable(key, rows);
  return newRow;
}

/** Met à jour une ligne par sa clé primaire. */
export function updateRow<T>(
  key: string,
  id: string,
  patch: Partial<T>,
  idKey: keyof T = "id" as keyof T,
): T | null {
  const rows = readTable<T>(key);
  const index = rows.findIndex((r) => (r[idKey] as unknown as string) === id);
  if (index === -1) return null;
  rows[index] = { ...rows[index], ...patch };
  writeTable(key, rows);
  return rows[index];
}

/** Supprime une ligne par sa clé primaire. */
export function deleteRow<T>(
  key: string,
  id: string,
  idKey: keyof T = "id" as keyof T,
): boolean {
  const rows = readTable<T>(key);
  const filtered = rows.filter((r) => (r[idKey] as unknown as string) !== id);
  if (filtered.length === rows.length) return false;
  writeTable(key, filtered);
  return true;
}

/** Récupère une ligne par sa clé primaire. */
export function findRow<T>(
  key: string,
  id: string,
  idKey: keyof T = "id" as keyof T,
): T | null {
  const rows = readTable<T>(key);
  return rows.find((r) => (r[idKey] as unknown as string) === id) ?? null;
}

export function ensureSeeded(
  seed: (helpers: {
    set: <T>(key: string, rows: T[]) => void;
    isSeeded: boolean;
  }) => void,
): void {
  if (!isBrowser()) return;
  const isSeeded = localStorage.getItem(SEED_FLAG) === "true";
  if (isSeeded) return;
  seed({ isSeeded: false, set: <T>(key: string, rows: T[]) => writeTable(key, rows) });
  localStorage.setItem(SEED_FLAG, "true");
}

export function resetFakeDb(): void {
  if (!isBrowser()) return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith("efact:"))
    .forEach((k) => localStorage.removeItem(k));
}
