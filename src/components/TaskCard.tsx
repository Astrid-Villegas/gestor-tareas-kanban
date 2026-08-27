"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertCircle, Calendar } from "lucide-react";
import type { Task } from "@/types";
import { PriorityTag, PRIORITY_ACCENT } from "./PriorityTag";

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
      className={`group relative cursor-grab overflow-hidden rounded-xl border border-slate-200 bg-white p-3 pl-4 text-left shadow-sm transition-all duration-150 active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800 ${
        isDragging
          ? "scale-[0.98] opacity-30"
          : "hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-lg"
      } ${dragOverlay ? "rotate-2 scale-105 shadow-2xl ring-2 ring-indigo-400" : ""}`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${PRIORITY_ACCENT[task.priority]}`}
      />
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
          {overdue ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : (
            <Calendar className="h-3.5 w-3.5" />
          )}
          <span>{formatDueDate(task.dueDate)}</span>
          {overdue && <span>· Vencida</span>}
        </div>
      )}
    </div>
  );
}
