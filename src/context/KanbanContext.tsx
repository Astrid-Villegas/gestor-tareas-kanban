"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Board, Column, KanbanState, Priority, Task } from "@/types";
import { generateId } from "@/lib/id";
import { createSeedState } from "@/lib/seed";
import { loadState, saveState } from "@/lib/storage";

type Action =
  | { type: "LOAD_STATE"; payload: KanbanState }
  | { type: "ADD_BOARD"; payload: { name: string } }
  | { type: "DELETE_BOARD"; payload: { boardId: string } }
  | { type: "SET_ACTIVE_BOARD"; payload: { boardId: string } }
  | { type: "ADD_COLUMN"; payload: { boardId: string; title: string } }
  | {
      type: "RENAME_COLUMN";
      payload: { boardId: string; columnId: string; title: string };
    }
  | { type: "DELETE_COLUMN"; payload: { boardId: string; columnId: string } }
  | {
      type: "ADD_TASK";
      payload: {
        boardId: string;
        columnId: string;
        task: {
          title: string;
          description?: string;
          priority: Priority;
          dueDate?: string;
        };
      };
    }
  | {
      type: "UPDATE_TASK";
      payload: {
        boardId: string;
        columnId: string;
        taskId: string;
        updates: Partial<Omit<Task, "id" | "createdAt">>;
      };
    }
  | {
      type: "DELETE_TASK";
      payload: { boardId: string; columnId: string; taskId: string };
    }
  | {
      type: "SET_BOARD_COLUMNS";
      payload: { boardId: string; columns: Column[] };
    };

function updateBoard(
  state: KanbanState,
  boardId: string,
  updater: (board: Board) => Board
): KanbanState {
  return {
    ...state,
    boards: state.boards.map((board) =>
      board.id === boardId ? updater(board) : board
    ),
  };
}

function reducer(state: KanbanState, action: Action): KanbanState {
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload;

    case "ADD_BOARD": {
      const newBoard: Board = {
        id: generateId(),
        name: action.payload.name,
        createdAt: Date.now(),
        columns: [
          { id: generateId(), title: "Por hacer", tasks: [] },
          { id: generateId(), title: "En progreso", tasks: [] },
          { id: generateId(), title: "Hecho", tasks: [] },
        ],
      };
      return {
        boards: [...state.boards, newBoard],
        activeBoardId: newBoard.id,
      };
    }

    case "DELETE_BOARD": {
      if (state.boards.length <= 1) return state;
      const remaining = state.boards.filter(
        (board) => board.id !== action.payload.boardId
      );
      const activeBoardId =
        state.activeBoardId === action.payload.boardId
          ? remaining[0]?.id ?? ""
          : state.activeBoardId;
      return { boards: remaining, activeBoardId };
    }

    case "SET_ACTIVE_BOARD":
      return { ...state, activeBoardId: action.payload.boardId };

    case "ADD_COLUMN":
      return updateBoard(state, action.payload.boardId, (board) => ({
        ...board,
        columns: [
          ...board.columns,
          { id: generateId(), title: action.payload.title, tasks: [] },
        ],
      }));

    case "RENAME_COLUMN":
      return updateBoard(state, action.payload.boardId, (board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === action.payload.columnId
            ? { ...column, title: action.payload.title }
            : column
        ),
      }));

    case "DELETE_COLUMN":
      return updateBoard(state, action.payload.boardId, (board) => ({
        ...board,
        columns: board.columns.filter(
          (column) => column.id !== action.payload.columnId
        ),
      }));

    case "ADD_TASK": {
      const task: Task = {
        id: generateId(),
        createdAt: Date.now(),
        ...action.payload.task,
      };
      return updateBoard(state, action.payload.boardId, (board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === action.payload.columnId
            ? { ...column, tasks: [...column.tasks, task] }
            : column
        ),
      }));
    }

    case "UPDATE_TASK":
      return updateBoard(state, action.payload.boardId, (board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === action.payload.columnId
            ? {
                ...column,
                tasks: column.tasks.map((task) =>
                  task.id === action.payload.taskId
                    ? { ...task, ...action.payload.updates }
                    : task
                ),
              }
            : column
        ),
      }));

    case "DELETE_TASK":
      return updateBoard(state, action.payload.boardId, (board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === action.payload.columnId
            ? {
                ...column,
                tasks: column.tasks.filter(
                  (task) => task.id !== action.payload.taskId
                ),
              }
            : column
        ),
      }));

    case "SET_BOARD_COLUMNS":
      return updateBoard(state, action.payload.boardId, (board) => ({
        ...board,
        columns: action.payload.columns,
      }));

    default:
      return state;
  }
}

interface KanbanContextValue {
  state: KanbanState;
  dispatch: Dispatch<Action>;
  activeBoard: Board | undefined;
  hydrated: boolean;
  addBoard: (name: string) => void;
  deleteBoard: (boardId: string) => void;
  setActiveBoard: (boardId: string) => void;
  addColumn: (boardId: string, title: string) => void;
  renameColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addTask: (
    boardId: string,
    columnId: string,
    task: {
      title: string;
      description?: string;
      priority: Priority;
      dueDate?: string;
    }
  ) => void;
  updateTask: (
    boardId: string,
    columnId: string,
    taskId: string,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  setBoardColumns: (boardId: string, columns: Column[]) => void;
}

const KanbanContext = createContext<KanbanContextValue | undefined>(
  undefined
);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeedState);
  const [hydrated, setHydrated] = useState(false);

  // Al montar en el cliente, se reemplaza la semilla por lo que haya
  // guardado en localStorage (si existe). `hydrated` evita mostrar el
  // tablero real hasta que sepamos qué datos usar, así el HTML del
  // servidor y el primer render del cliente coinciden.
  useEffect(() => {
    const stored = loadState();
    if (stored) {
      dispatch({ type: "LOAD_STATE", payload: stored });
    }
    // Marca la hidratación como completa una sola vez tras montar; es un
    // gate intencional para el primer render en cliente, no una
    // sincronización continua.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  const addBoard = useCallback(
    (name: string) => dispatch({ type: "ADD_BOARD", payload: { name } }),
    []
  );
  const deleteBoard = useCallback(
    (boardId: string) => dispatch({ type: "DELETE_BOARD", payload: { boardId } }),
    []
  );
  const setActiveBoard = useCallback(
    (boardId: string) =>
      dispatch({ type: "SET_ACTIVE_BOARD", payload: { boardId } }),
    []
  );
  const addColumn = useCallback(
    (boardId: string, title: string) =>
      dispatch({ type: "ADD_COLUMN", payload: { boardId, title } }),
    []
  );
  const renameColumn = useCallback(
    (boardId: string, columnId: string, title: string) =>
      dispatch({
        type: "RENAME_COLUMN",
        payload: { boardId, columnId, title },
      }),
    []
  );
  const deleteColumn = useCallback(
    (boardId: string, columnId: string) =>
      dispatch({ type: "DELETE_COLUMN", payload: { boardId, columnId } }),
    []
  );
  const addTask = useCallback(
    (
      boardId: string,
      columnId: string,
      task: {
        title: string;
        description?: string;
        priority: Priority;
        dueDate?: string;
      }
    ) => dispatch({ type: "ADD_TASK", payload: { boardId, columnId, task } }),
    []
  );
  const updateTask = useCallback(
    (
      boardId: string,
      columnId: string,
      taskId: string,
      updates: Partial<Omit<Task, "id" | "createdAt">>
    ) =>
      dispatch({
        type: "UPDATE_TASK",
        payload: { boardId, columnId, taskId, updates },
      }),
    []
  );
  const deleteTask = useCallback(
    (boardId: string, columnId: string, taskId: string) =>
      dispatch({ type: "DELETE_TASK", payload: { boardId, columnId, taskId } }),
    []
  );
  const setBoardColumns = useCallback(
    (boardId: string, columns: Column[]) =>
      dispatch({ type: "SET_BOARD_COLUMNS", payload: { boardId, columns } }),
    []
  );

  const activeBoard = useMemo(
    () => state.boards.find((board) => board.id === state.activeBoardId),
    [state.boards, state.activeBoardId]
  );

  const value: KanbanContextValue = {
    state,
    dispatch,
    activeBoard,
    hydrated,
    addBoard,
    deleteBoard,
    setActiveBoard,
    addColumn,
    renameColumn,
    deleteColumn,
    addTask,
    updateTask,
    deleteTask,
    setBoardColumns,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
}

export function useKanban(): KanbanContextValue {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban debe usarse dentro de un KanbanProvider");
  }
  return context;
}
