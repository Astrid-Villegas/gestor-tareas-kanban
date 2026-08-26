import type { Priority } from "@/types";

const STYLES: Record<Priority, string> = {
  baja:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  media:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  alta: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

const LABELS: Record<Priority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export function PriorityTag({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
