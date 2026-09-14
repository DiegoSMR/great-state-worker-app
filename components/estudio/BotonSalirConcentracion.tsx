"use client";

import { usePreferencias } from "@/components/preferencias/PreferenciasProvider";
import { IconoCerrar } from "@/components/nav/iconos";

/**
 * Único control de navegación visible en modo concentración (Requisito 9.3)
 * — no navega a ningún sitio, solo alterna el estado.
 */
export function BotonSalirConcentracion() {
  const { toggleConcentracion } = usePreferencias();
  return (
    <button
      type="button"
      onClick={toggleConcentracion}
      aria-label="Salir del modo concentración"
      className="fixed right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-borde bg-bg-primario px-3 py-2 text-sm font-medium text-texto-primario shadow-sm hover:bg-bg-secundario"
    >
      <IconoCerrar aria-hidden width="1em" height="1em" />
      Salir de concentración
    </button>
  );
}
