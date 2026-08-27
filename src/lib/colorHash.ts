// Asigna un color estable a un id (de columna o tablero) mediante un hash
// simple del string. Así, aunque el usuario renombre una columna o cree
// tableros nuevos, cada uno conserva siempre el mismo color de identidad
// en vez de depender de un mapeo fijo por nombre.

interface IdColor {
  name: string;
  dot: string;
  border: string;
  text: string;
  ring: string;
}

const PALETTE: IdColor[] = [
  {
    name: "indigo",
    dot: "bg-indigo-500",
    border: "border-t-indigo-500 dark:border-t-indigo-400",
    text: "text-indigo-600 dark:text-indigo-400",
    ring: "ring-indigo-400/60",
  },
  {
    name: "amber",
    dot: "bg-amber-500",
    border: "border-t-amber-500 dark:border-t-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-400/60",
  },
  {
    name: "emerald",
    dot: "bg-emerald-500",
    border: "border-t-emerald-500 dark:border-t-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-400/60",
  },
  {
    name: "sky",
    dot: "bg-sky-500",
    border: "border-t-sky-500 dark:border-t-sky-400",
    text: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-400/60",
  },
  {
    name: "fuchsia",
    dot: "bg-fuchsia-500",
    border: "border-t-fuchsia-500 dark:border-t-fuchsia-400",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    ring: "ring-fuchsia-400/60",
  },
  {
    name: "rose",
    dot: "bg-rose-500",
    border: "border-t-rose-500 dark:border-t-rose-400",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-400/60",
  },
  {
    name: "teal",
    dot: "bg-teal-500",
    border: "border-t-teal-500 dark:border-t-teal-400",
    text: "text-teal-600 dark:text-teal-400",
    ring: "ring-teal-400/60",
  },
  {
    name: "orange",
    dot: "bg-orange-500",
    border: "border-t-orange-500 dark:border-t-orange-400",
    text: "text-orange-600 dark:text-orange-400",
    ring: "ring-orange-400/60",
  },
];

export function getIdColor(id: string): IdColor {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}
