"use client";

import type { ReactNode } from "react";
import { usePreferencias } from "@/components/preferencias/PreferenciasProvider";

/**
 * Envuelve metadatos de cabecera no esenciales de la vista de concepto
 * (oposiciones asociadas, badge de núcleo común) para ocultarlos en modo
 * concentración — design.md, decisión "Modo concentración": "Metadatos de
 * cabecera no esenciales... se ocultan con una clase condicional; el título
 * del concepto se mantiene visible" (Requisito 9.1, 9.2). La página de
 * concepto es un Server Component y `concentracion` es estado de sesión que
 * solo existe en el contexto de cliente (PreferenciasProvider) — este
 * wrapper es la frontera mínima entre ambos, sin convertir toda la página en
 * cliente.
 */
export function OcultarEnConcentracion({ children }: { children: ReactNode }) {
  const { concentracion } = usePreferencias();
  if (concentracion) return null;
  return <>{children}</>;
}
