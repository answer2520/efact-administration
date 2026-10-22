import { getAuthToken } from "@/features/auth/session";
import { ApiError } from "./api-error";

/**
 * Client HTTP basé sur `fetch` qui :
 *  - injecte le Bearer token depuis la session
 *  - convertit les réponses d'erreur en `ApiError`
 *  - parse automatiquement le JSON
 *
 * Utilisé par les implémentations `http.ts` de chaque feature.
 */

interface HttpOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  /** Mettre à `true` pour ne pas envoyer le token (ex. login). */
  skipAuth?: boolean;
  headers?: Record<string, string>;
}

export async function httpClient<T>(
  path: string,
  options: HttpOptions = {},
): Promise<T> {
  const { body, skipAuth, headers, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (!skipAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const baseUrl = process.env.API_BASE_URL ?? "";

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Échec de la requête réseau.");
  }

  if (!response.ok) {
    let code = "INTERNAL_ERROR";
    let message = `HTTP ${response.status}`;

    try {
      const errorBody = await response.json();
      code = errorBody.code ?? code;
      message = errorBody.message ?? message;
    } catch {
      // Réponse sans corps JSON valide
    }

    throw new ApiError(response.status, code, message);
  }

  // Réponses 204 ou sans contenu
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
