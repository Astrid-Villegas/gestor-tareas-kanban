/**
 * Genera un identificador único, usando crypto.randomUUID cuando está
 * disponible y recurriendo a una alternativa simple en su defecto.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
