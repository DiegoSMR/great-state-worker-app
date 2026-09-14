import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { PREFERENCIAS_COOKIE, parsearPreferencias } from "@/lib/preferencias";
import { PreferenciasProvider } from "@/components/preferencias/PreferenciasProvider";
import { NavShell } from "@/components/nav/NavShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Great State Worker",
  description: "App de estudio para preparar oposiciones.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const cookieCruda = cookieStore.get(PREFERENCIAS_COOKIE)?.value;
  const preferencias = parsearPreferencias(cookieCruda);

  // Anti-flash (design.md): sin cookie todavía, no se escribe data-theme —
  // deja decidir a prefers-color-scheme (Requisito 3.1) hasta que exista una
  // elección explícita. El tamaño de letra sí tiene default explícito
  // siempre, porque no existe un equivalente de prefers-* para eso.
  const temaExplicito = cookieCruda !== undefined;

  return (
    <html
      lang="es"
      data-theme={temaExplicito ? preferencias.tema : undefined}
      data-tamano-letra={preferencias.lectura.tamanoLetra}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <PreferenciasProvider preferenciasIniciales={preferencias}>
          <NavShell>{children}</NavShell>
        </PreferenciasProvider>
      </body>
    </html>
  );
}
