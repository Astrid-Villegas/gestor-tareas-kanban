"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Board, Column as ColumnType, Task } from "@/types";
import { useKanban } from "@/context/KanbanContext";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { TaskModal, type TaskFormValues } from "./TaskModal";

function findColumnByTaskId(
  columns: ColumnType[],
  taskId: string
): ColumnType | undefined {
  return columns.find((column) => column.tasks.some((task) => task.id === taskId));
}

function findColumnById(
  columns: ColumnType[],
  columnId: string
): ColumnType | undefined {
  return columns.find((column) => column.id === columnId);
}

interface EditingTarget {
  columnId: string;
  task: Task | null;
}

export function KanbanBoard({ board }: { board: Board }) {
  const { addColumn, addTask, updateTask, deleteTask, renameColumn, deleteColumn, setBoardColumns } =
    useKanban();

  const [columns, setColumns] = useState<ColumnType[]>(board.columns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editing, setEditing] = useState<EditingTarget | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Se mantiene una copia local de las columnas para dar feedback visual
  // instantáneo mientras se arrastra una tarjeta (sin escribir en
  // localStorage en cada evento). Cuando el tablero activo cambia o se
  // actualiza desde el contexto (añadir/renombrar/eliminar), se
  // resincroniza esta copia local.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColumns(board.columns);
  }, [board]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeIsDone = useMemo(() => {
    if (!editing) return false;
    const column = findColumnById(columns, editing.columnId);
    return Boolean(column && /hecho|completad|listo|terminad|done/i.test(column.title));
  }, [editing, columns]);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const column = findColumnByTaskId(columns, String(active.id));
    const task = column?.tasks.find((t) => t.id === active.id) ?? null;
    setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeColumn = findColumnByTaskId(columns, activeId);
    const overColumn =
      findColumnById(columns, overId) ?? findColumnByTaskId(columns, overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    setColumns((prev) => {
      const sourceColumn = prev.find((c) => c.id === activeColumn.id);
      const destColumn = prev.find((c) => c.id === overColumn.id);
      if (!sourceColumn || !destColumn) return prev;

      const activeIndex = sourceColumn.tasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return prev;
      const movingTask = sourceColumn.tasks[activeIndex];

      const overIndex = destColumn.tasks.findIndex((t) => t.id === overId);
      const insertIndex = overIndex >= 0 ? overIndex : destColumn.tasks.length;

      return prev.map((c) => {
        if (c.id === sourceColumn.id) {
          return { ...c, tasks: c.tasks.filter((t) => t.id !== activeId) };
        }
        if (c.id === destColumn.id) {
          const newTasks = [...c.tasks];
          newTasks.splice(insertIndex, 0, movingTask);
          return { ...c, tasks: newTasks };
        }
        return c;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) {
      setBoardColumns(board.id, columns);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumnByTaskId(columns, activeId);
    const overColumn =
      findColumnById(columns, overId) ?? findColumnByTaskId(columns, overId);

    if (!activeColumn || !overColumn) {
      setBoardColumns(board.id, columns);
      return;
    }

    if (activeColumn.id === overColumn.id && activeId !== overId) {
      const activeIndex = activeColumn.tasks.findIndex((t) => t.id === activeId);
      const overIndex = activeColumn.tasks.findIndex((t) => t.id === overId);
      if (activeIndex !== -1 && overIndex !== -1) {
        const finalColumns = columns.map((c) =>
          c.id === activeColumn.id
            ? { ...c, tasks: arrayMove(c.tasks, activeIndex, overIndex) }
            : c
        );
        setColumns(finalColumns);
        setBoardColumns(board.id, finalColumns);
        return;
      }
    }

    setBoardColumns(board.id, columns);
  }

  function handleAddColumn() {
    const title = newColumnTitle.trim();
    if (!title) {
      setIsAddingColumn(false);
      return;
    }
    addColumn(board.id, title);
    setNewColumnTitle("");
    setIsAddingColumn(false);
  }

  function handleTaskSubmit(values: TaskFormValues) {
    if (!editing) return;
    if (editing.task) {
      updateTask(board.id, editing.columnId, editing.task.id, values);
    } else {
      addTask(board.id, editing.columnId, values);
    }
    setEditing(null);
  }

  function handleTaskDelete() {
    if (!editing?.task) return;
    deleteTask(board.id, editing.columnId, editing.task.id);
    setEditing(null);
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board-canvas flex h-full flex-1 items-start gap-4 overflow-x-auto p-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={() => setEditing({ columnId: column.id, task: null })}
              onOpenTask={(task) => setEditing({ columnId: column.id, task })}
              onRename={(title) => renameColumn(board.id, column.id, title)}
              onDelete={() => deleteColumn(board.id, column.id)}
            />
          ))}

          <div className="w-72 shrink-0">
            {isAddingColumn ? (
              <div className="rounded-2xl bg-slate-100/70 p-3 dark:bg-slate-900/40">
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(event) => setNewColumnTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleAddColumn();
                    if (event.key === "Escape") {
                      setIsAddingColumn(false);
                      setNewColumnTitle("");
                    }
                  }}
                  placeholder="Nombre de la columna"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddColumn}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Añadir
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnTitle("");
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-700/60"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingColumn(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 px-4 py-4 text-sm font-medium text-slate-400 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12 4.5a.75.75 0 01.75.75v6h6a.75.75 0 010 1.5h-6v6a.75.75 0 01-1.5 0v-6h-6a.75.75 0 010-1.5h6v-6A.75.75 0 0112 4.5z" />
                </svg>
                Añadir columna
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} isDone={activeIsDone} onClick={() => {}} dragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={Boolean(editing)}
        initialTask={editing?.task ?? null}
        columnTitle={
          editing ? findColumnById(columns, editing.columnId)?.title ?? "" : ""
        }
        onClose={() => setEditing(null)}
        onSubmit={handleTaskSubmit}
        onDelete={editing?.task ? handleTaskDelete : undefined}
      />
    </div>
  );
}
