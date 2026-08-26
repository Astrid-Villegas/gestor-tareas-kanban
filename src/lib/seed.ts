import { generateId } from "./id";
import type { Board, KanbanState, Task } from "@/types";

function offsetDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  // Se construye la cadena yyyy-mm-dd a partir de los componentes locales
  // (no con toISOString, que convierte a UTC y puede desplazar el día
  // según la zona horaria del usuario).
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function makeTask(partial: Omit<Task, "id" | "createdAt">): Task {
  return {
    id: generateId(),
    createdAt: Date.now(),
    ...partial,
  };
}

/**
 * Crea un tablero de ejemplo con columnas y tarjetas de muestra para que la
 * aplicación no se sienta vacía la primera vez que se abre.
 */
export function createSeedState(): KanbanState {
  const board: Board = {
    id: generateId(),
    name: "Lanzamiento del sitio web",
    createdAt: Date.now(),
    columns: [
      {
        id: generateId(),
        title: "Por hacer",
        tasks: [
          makeTask({
            title: "Definir la paleta de colores",
            description: "Elegir colores primarios y secundarios para la marca y documentarlos en Figma.",
            priority: "media",
            dueDate: offsetDate(5),
          }),
          makeTask({
            title: "Redactar textos de la landing page",
            description: "Incluir titular, subtítulo y llamada a la acción principal.",
            priority: "baja",
            dueDate: offsetDate(9),
          }),
          makeTask({
            title: "Investigar a la competencia",
            priority: "baja",
          }),
        ],
      },
      {
        id: generateId(),
        title: "En progreso",
        tasks: [
          makeTask({
            title: "Maquetar la página de inicio",
            description: "Convertir el diseño de Figma en componentes de Next.js con Tailwind.",
            priority: "alta",
            dueDate: offsetDate(2),
          }),
          makeTask({
            title: "Configurar el formulario de contacto",
            description: "Validaciones en el cliente y envío mediante una API route.",
            priority: "media",
            dueDate: offsetDate(-1),
          }),
        ],
      },
      {
        id: generateId(),
        title: "Hecho",
        tasks: [
          makeTask({
            title: "Elegir el stack tecnológico",
            description: "Next.js + TypeScript + Tailwind CSS + dnd-kit.",
            priority: "alta",
          }),
          makeTask({
            title: "Crear el repositorio en GitHub",
            priority: "baja",
          }),
        ],
      },
    ],
  };

  return {
    boards: [board],
    activeBoardId: board.id,
  };
}
