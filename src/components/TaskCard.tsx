"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { PriorityTag } from "./PriorityTag";

function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dueDate.split("-").map(Number);
  const due = new Date(year, (month ?? 1) - 1, day ?? 1);
  return due.getTime() < today.getTime();
}

interface TaskCardProps {
  task: Task;
  isDone: boolean;
  onClick: () => void;
  dragOverlay?: boolean;
}

export function TaskCard({ task, isDone, onClick, dragOverlay = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = !isDone && Boolean(task.dueDate) && isOverdue(task.dueDate!);

  return (
    <div
      ref={dragOverlay ? undefined : setNodeRef}
      style={dragOverlay ? undefined : style}
      {...(dragOverlay ? {} : attributes)}
      {...(dragOverlay ? {} : listeners)}
      onClick={onClick}
      className={`group cursor-grab rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 ${
        isDragging ? "opacity-30" : "hover:-translate-y-0.5 hover:shadow-md"
      } ${dragOverlay ? "rotate-2 shadow-xl ring-2 ring-indigo-400" : ""}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {task.title}
        </h3>
        <PriorityTag priority={task.priority} />
      </div>
      {task.description && (
        <p className="mb-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {task.description}
        </p>
      )}
      {task.dueDate && (
        <div
          className={`inline-flex items-center gap-1 text-xs ${
            overdue
              ? "font-medium text-rose-600 dark:text-rose-400"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
              clipRule="evenodd"
            />
          </svg>
          {formatDueDate(task.dueDate)}
          {overdue && " · vencida"}
        </div>
      )}
    </div>
  );
}
