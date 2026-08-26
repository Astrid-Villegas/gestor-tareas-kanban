import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { KanbanProvider } from "@/context/KanbanContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor de Tareas Kanban",
  description:
    "Tablero Kanban con drag-and-drop, múltiples tableros y modo oscuro, hecho con Next.js y dnd-kit.",
};

// Aplica el tema guardado antes del primer pintado para evitar un
// parpadeo entre modo claro y oscuro al cargar la página.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("kanban-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <KanbanProvider>{children}</KanbanProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
