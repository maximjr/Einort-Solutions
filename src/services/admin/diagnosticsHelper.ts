export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST   = "list",
  GET    = "get",
  WRITE  = "write",
}

/**
 * Standardised Firestore error handler.
 *
 * In production, logs only the operation context — never the requesting user's
 * PII (UID, email, provider data). The previous version logged a full
 * FirestoreErrorInfo object that included uid, email, emailVerified, tenantId,
 * and providerData on every Firestore error, violating GDPR Article 32.
 *
 * In development (import.meta.env.DEV), the full error is logged for
 * debugging convenience.
 */
export function handleFirestoreError(
  error:         unknown,
  operationType: OperationType,
  path:          string | null,
): never {
  const message = error instanceof Error ? error.message : String(error);
  const isPermissionError = message.includes("Missing or insufficient permissions");

  if (!isPermissionError) {
    if (import.meta.env.DEV) {
      // Dev: full context — never reaches production users
      console.error("[Firestore Error]", { operationType, path, message });
    } else {
      // Prod: operation context only, no PII
      console.error(`[Firestore Error] ${operationType} on ${path ?? "unknown"}: ${message}`);
    }
  }

  // Throw a clean message — do not embed PII in the error string
  throw new Error(`Firestore ${operationType} failed${path ? ` on ${path}` : ""}: ${message}`);
}
