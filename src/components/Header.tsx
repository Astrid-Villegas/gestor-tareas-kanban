"use client";

import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  boardName: string;
  columnCount: number;
  taskCount: number;
  onOpenSidebar: () => void;
}

export function Header({ boardName, columnCount, taskCount, onOpenSidebar }: HeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Abrir tableros"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-800 dark:text-slate-100">
            {boardName}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {columnCount} columna{columnCount === 1 ? "" : "s"} · {taskCount} tarjeta
            {taskCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
