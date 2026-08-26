export type Priority = "baja" | "media" | "alta";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // formato ISO yyyy-mm-dd
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: number;
}

export interface KanbanState {
  boards: Board[];
  activeBoardId: string;
}
