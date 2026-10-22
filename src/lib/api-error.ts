/**
 * Erreur normalisée renvoyée par la couche API (fake ou http).
 *
 * `status`  : code HTTP (4xx / 5xx) ou 0 pour les erreurs réseau.
 * `code`    : code métier stable, ex. "AUTH_INVALID_CREDENTIALS".
 * `message` : message technique destiné aux logs.
 *
 * Pour afficher un message à l'utilisateur, utiliser `getErrorMessage(code)`
 * depuis `error-messages.ts`.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(status: number, code: string, message?: string): ApiError {
    return new ApiError(status, code, message ?? code);
  }
}
