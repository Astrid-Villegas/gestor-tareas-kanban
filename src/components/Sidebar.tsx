"use client";

import { useState } from "react";
import { useKanban } from "@/context/KanbanContext";
import { ConfirmDialog } from "./ConfirmDialog";
import { getIdColor } from "@/lib/colorHash";

function countTasks(board: { columns: { tasks: unknown[] }[] }): number {
  return board.columns.reduce((total, column) => total + column.tasks.length, 0);
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { state, addBoard, deleteBoard, setActiveBoard } = useKanban();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function handleCreate() {
    const trimmed = name.trim();
    if (trimmed) {
      addBoard(trimmed);
    }
    setName("");
    setIsCreating(false);
  }

  const boardToDelete = state.boards.find((b) => b.id === pendingDeleteId);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 px-3 py-3 text-white shadow-md shadow-indigo-600/20 dark:shadow-black/30">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3 3.75A.75.75 0 013.75 3h6.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75h-6.5a.75.75 0 01-.75-.75V3.75zM13.5 3.75a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75V3.75zM13.5 17.25a.75.75 0 01.75-.75h6a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-6a.75.75 0 01-.75-.75v-3z" />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="block truncate text-sm font-semibold">Gestor Kanban</span>
            <span className="block truncate text-[11px] text-indigo-100/85">
              {state.boards.length} tablero{state.boards.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Tableros
          </h2>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {state.boards.map((board) => {
            const isActive = board.id === state.activeBoardId;
            const color = getIdColor(board.id);
            const taskCount = countTasks(board);
            return (
              <div
                key={board.id}
                className={`group relative rounded-lg ${
                  isActive ? "bg-indigo-50 dark:bg-indigo-500/15" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveBoard(board.id);
                    onClose();
                  }}
                  className={`flex w-full min-w-0 items-center gap-2 rounded-lg border-l-[3px] py-2 pl-2 pr-8 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "border-indigo-500 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
                      : "border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${color.dot}`} />
                  <span className="min-w-0 flex-1 truncate">{board.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                      isActive
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300"
                        : "bg-slate-200/70 text-slate-500 dark:bg-slate-700/70 dark:text-slate-400"
                    }`}
                  >
                    {taskCount}
                  </span>
                </button>
                {state.boards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(board.id)}
                    aria-label={`Eliminar tablero ${board.name}`}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 opacity-0 transition-opacity hover:bg-rose-100 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L10.94 12l-5.72 5.72a.75.75 0 101.06 1.06L12 13.06l5.72 5.72a.75.75 0 101.06-1.06L13.06 12l5.72-5.72a.75.75 0 00-1.06-1.06L12 10.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          {isCreating ? (
            <div className="space-y-2">
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleCreate();
                  if (event.key === "Escape") {
                    setIsCreating(false);
                    setName("");
                  }
                }}
                placeholder="Nombre del tablero"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreate}
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setName("");
                  }}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 4.5a.75.75 0 01.75.75v6h6a.75.75 0 010 1.5h-6v6a.75.75 0 01-1.5 0v-6h-6a.75.75 0 010-1.5h6v-6A.75.75 0 0112 4.5z" />
              </svg>
              Nuevo tablero
            </button>
          )}
        </div>
      </aside>

      <ConfirmDialog
        open={Boolean(boardToDelete)}
        title="Eliminar tablero"
        description={
          boardToDelete
            ? `Se eliminará "${boardToDelete.name}" junto con todas sus columnas y tarjetas.`
            : undefined
        }
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          if (pendingDeleteId) deleteBoard(pendingDeleteId);
          setPendingDeleteId(null);
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
