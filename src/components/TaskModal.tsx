"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Priority, Task } from "@/types";

export interface TaskFormValues {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
}

interface TaskModalProps {
  open: boolean;
  initialTask?: Task | null;
  columnTitle: string;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  onDelete?: () => void;
}

const EMPTY_FORM: TaskFormValues = {
  title: "",
  description: "",
  priority: "media",
  dueDate: "",
};

export function TaskModal({
  open,
  initialTask,
  columnTitle,
  onClose,
  onSubmit,
  onDelete,
}: TaskModalProps) {
  const [values, setValues] = useState<TaskFormValues>(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    // Reinicia el formulario cada vez que el modal se abre (para crear o
    // editar una tarjeta distinta); es un reseteo puntual, no una
    // sincronización continua con el estado externo.
    if (initialTask) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues({
        title: initialTask.title,
        description: initialTask.description ?? "",
        priority: initialTask.priority,
        dueDate: initialTask.dueDate ?? "",
      });
    } else {
      setValues(EMPTY_FORM);
    }
    setError("");
  }, [open, initialTask]);

  if (!open) return null;

  const isEditing = Boolean(initialTask);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = values.title.trim();
    if (!title) {
      setError("El título es obligatorio.");
      return;
    }
    onSubmit({
      title,
      description: values.description?.trim() || undefined,
      priority: values.priority,
      dueDate: values.dueDate || undefined,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {isEditing ? "Editar tarjeta" : "Nueva tarjeta"}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Columna: {columnTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L10.94 12l-5.72 5.72a.75.75 0 101.06 1.06L12 13.06l5.72 5.72a.75.75 0 101.06-1.06L13.06 12l5.72-5.72a.75.75 0 00-1.06-1.06L12 10.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Título
            </label>
            <input
              id="task-title"
              type="text"
              value={values.title}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Ej. Diseñar la pantalla de login"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Descripción{" "}
              <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <textarea
              id="task-description"
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              placeholder="Añade más detalles sobre la tarea..."
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="task-priority"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Prioridad
              </label>
              <select
                id="task-priority"
                value={values.priority}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    priority: event.target.value as Priority,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-due-date"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Fecha límite{" "}
                <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                value={values.dueDate}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    dueDate: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  Eliminar
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {isEditing ? "Guardar cambios" : "Crear tarjeta"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
