# Gestor de Tareas Kanban 📋

Tablero Kanban tipo Trello con **arrastrar y soltar (drag & drop)**, múltiples tableros y modo oscuro. Proyecto de portafolio construido con Next.js, TypeScript y `dnd-kit`.

> Aplicación 100% del lado del cliente: no necesita backend ni base de datos, todos los datos se guardan en el `localStorage` del navegador.

## ✨ Características

- **Múltiples tableros**: barra lateral para crear tableros nuevos y cambiar entre ellos.
- **Columnas personalizables**: añade, renombra (clic sobre el título) y elimina columnas. Por defecto: "Por hacer", "En progreso" y "Hecho".
- **Tarjetas de tareas** con título, descripción opcional, prioridad (baja/media/alta, con etiqueta de color verde/amarillo/rojo) y fecha límite opcional (con aviso visual si está vencida).
- **Arrastrar y soltar** con [`@dnd-kit`](https://dndkit.com/): reordena tarjetas dentro de una columna o muévelas entre columnas, con retroalimentación visual (la tarjeta se eleva con sombra, la columna destino se resalta).
- **Persistencia automática** en `localStorage`: tableros, columnas y tarjetas se guardan al instante y se recuperan al recargar la página.
- **Modo claro / oscuro** con detector de preferencia del sistema y botón para alternar manualmente.
- **Datos de ejemplo**: la primera vez que se abre la app se genera un tablero de muestra con columnas y tarjetas, para no partir de una pantalla vacía.
- **Diseño responsive** pensado para escritorio y móvil, con barra lateral colapsable.

## 🛠️ Tecnologías

- [Next.js 14+](https://nextjs.org/) (App Router) + [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) en modo estricto
- [Tailwind CSS](https://tailwindcss.com/) para los estilos
- [`@dnd-kit/core`](https://www.npmjs.com/package/@dnd-kit/core), [`@dnd-kit/sortable`](https://www.npmjs.com/package/@dnd-kit/sortable) y [`@dnd-kit/utilities`](https://www.npmjs.com/package/@dnd-kit/utilities) para el drag & drop
- `localStorage` del navegador como única capa de persistencia (sin backend)

## 📁 Estructura del proyecto

```
gestor-tareas-kanban/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # layout raíz, providers y script anti-parpadeo del tema
│   │   ├── page.tsx            # ensambla sidebar + header + tablero activo
│   │   └── globals.css         # Tailwind, variante de modo oscuro y scrollbars
│   ├── components/
│   │   ├── Sidebar.tsx         # listado de tableros, crear/eliminar tablero
│   │   ├── Header.tsx          # nombre del tablero, contador y toggle de tema
│   │   ├── KanbanBoard.tsx     # DndContext: lógica de arrastre entre columnas
│   │   ├── Column.tsx          # columna droppable, renombrar/eliminar, añadir tarjeta
│   │   ├── TaskCard.tsx        # tarjeta arrastrable (sortable) con prioridad y fecha
│   │   ├── TaskModal.tsx       # formulario modal para crear/editar una tarjeta
│   │   ├── PriorityTag.tsx     # etiqueta de color según prioridad
│   │   ├── ConfirmDialog.tsx   # modal de confirmación para borrados
│   │   └── ThemeToggle.tsx     # botón de modo claro/oscuro
│   ├── context/
│   │   ├── KanbanContext.tsx   # estado global (reducer) + persistencia en localStorage
│   │   └── ThemeContext.tsx    # estado del tema (claro/oscuro)
│   ├── lib/
│   │   ├── storage.ts          # helpers de lectura/escritura de localStorage
│   │   ├── seed.ts             # datos de ejemplo para el primer uso
│   │   └── id.ts                # generador de identificadores únicos
│   └── types/
│       └── index.ts            # tipos: Board, Column, Task, Priority
└── public/
```

## 🚀 Instalación y uso

### Requisitos
- Node.js 18+

### Pasos

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador. No se necesita configurar ninguna variable de entorno ni base de datos: la app funciona por completo en el cliente.

Para generar una build de producción:

```bash
npm run build
npm start
```

## 📄 Licencia

Proyecto con fines educativos y de portafolio.
