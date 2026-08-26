import type { KanbanState } from "@/types";

export const STORAGE_KEY = "kanban-state-v1";
export const THEME_STORAGE_KEY = "kanban-theme";

export function loadState(): KanbanState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as KanbanState;
    if (!parsed || !Array.isArray(parsed.boards)) return null;
    return parsed;
  } catch (error) {
    console.warn("No se pudo leer el estado guardado del tablero:", error);
    return null;
  }
}

export function saveState(state: KanbanState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("No se pudo guardar el estado del tablero:", error);
  }
}
