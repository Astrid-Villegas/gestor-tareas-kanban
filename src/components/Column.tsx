"use client";

import { useMemo, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column as ColumnType, Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { ConfirmDialog } from "./ConfirmDialog";

interface ColumnProps {
  column: ColumnType;
  onAddTask: () => void;
  onOpenTask: (task: Task) => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

function looksDone(title: string): boolean {
  const normalized = title.trim().toLowerCase();
  return (
    normalized.includes("hecho") ||
    normalized.includes("completad") ||
    normalized.includes("listo") ||
    normalized.includes("terminad") ||
    normalized.includes("done")
  );
}

export function Column({
  column,
  onAddTask,
  onOpenTask,
  onRename,
  onDelete,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const taskIds = useMemo(() => column.tasks.map((task) => task.id), [column.tasks]);
  const isDone = looksDone(column.title);

  function commitRename() {
    const trimmed = title.trim();
    if (trimmed && trimmed !== column.title) {
      onRename(trimmed);
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  }

  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-900/40">
      <div className="flex items-center justify-between gap-2 px-3 pt-3">
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitRename();
              }
              if (event.key === "Escape") {
                setTitle(column.title);
                setIsEditing(false);
              }
            }}
            className="w-full rounded-lg border border-indigo-400 bg-white px-2 py-1 text-sm font-semibold text-slate-800 outline-none dark:bg-slate-800 dark:text-slate-100"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="truncate rounded-lg px-1 py-1 text-left text-sm font-semibold text-slate-700 hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-700/60"
            title="Haz clic para renombrar"
          >
            {column.title}
          </button>
        )}

        <div className="flex shrink-0 items-center gap-1">
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            {column.tasks.length}
          </span>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Eliminar columna"
            title="Eliminar columna"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0c.694.022 1.263.6 1.263 1.308v.145a49.24 49.24 0 00-5.798 0v-.145c0-.708.568-1.286 1.262-1.308zm5.512 5.955a.75.75 0 10-1.498-.078l-.36 6.759a.75.75 0 001.498.079l.36-6.76zm-6.75-.078a.75.75 0 00-1.498.078l.36 6.76a.75.75 0 101.498-.08l-.36-6.758z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`mx-2 mb-2 mt-2 flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-xl p-1.5 transition-colors ${
          isOver ? "bg-indigo-100/70 ring-2 ring-indigo-400 dark:bg-indigo-500/10" : ""
        }`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDone={isDone}
              onClick={() => onOpenTask(task)}
            />
          ))}
        </SortableContext>
        {column.tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 py-6 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Suelta una tarjeta aquí
          </div>
        )}
      </div>

      <div className="p-2 pt-0">
        <button
          type="button"
          onClick={onAddTask}
          className="flex w-full items-center justify-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 4.5a.75.75 0 01.75.75v6h6a.75.75 0 010 1.5h-6v6a.75.75 0 01-1.5 0v-6h-6a.75.75 0 010-1.5h6v-6A.75.75 0 0112 4.5z" />
          </svg>
          Añadir tarjeta
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar columna"
        description={`Se eliminará "${column.title}" junto con sus ${column.tasks.length} tarjeta(s). Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
