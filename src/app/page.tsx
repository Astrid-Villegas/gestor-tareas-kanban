"use client";

import { useMemo, useState } from "react";
import { useKanban } from "@/context/KanbanContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { KanbanBoard } from "@/components/KanbanBoard";

function BoardLoadingSkeleton() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500 dark:border-slate-700" />
        <p className="text-sm">Cargando tablero...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { activeBoard, hydrated } = useKanban();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const taskCount = useMemo(
    () =>
      activeBoard?.columns.reduce((total, column) => total + column.tasks.length, 0) ?? 0,
    [activeBoard]
  );

  if (!hydrated || !activeBoard) {
    return <BoardLoadingSkeleton />;
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          boardName={activeBoard.name}
          columnCount={activeBoard.columns.length}
          taskCount={taskCount}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <KanbanBoard board={activeBoard} />
      </div>
    </div>
  );
}
