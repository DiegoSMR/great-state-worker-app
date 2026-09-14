"use client";

import { useState, type ReactNode } from "react";
import { usePreferencias } from "@/components/preferencias/PreferenciasProvider";
import { PreferenciasPanel } from "@/components/preferencias/PreferenciasPanel";
import { BotonSalirConcentracion } from "@/components/estudio/BotonSalirConcentracion";
import { clasesVariante } from "@/lib/nav-densidad";
import { NavHamburguesa } from "./NavHamburguesa";
import { NavIconos } from "./NavIconos";
import { NavVisible } from "./NavVisible";

/**
 * Orquesta las tres variantes de densidad de navegación (Requisito 2) y el
 * modo concentración (Requisito 9). Las tres variantes se montan siempre —
 * la visibilidad la decide Tailwind puramente por CSS (clasesVariante), sin
 * ningún hook de matchMedia ni parpadeo al cambiar de breakpoint o de
 * elección manual.
 */
export function NavShell({ children }: { children: ReactNode }) {
  const { navDensidad, concentracion } = usePreferencias();
  // Un único panel de preferencias compartido por las tres variantes — si
  // cada variante montara el suyo, cambiar de densidad con el panel abierto
  // dejaría ese <dialog> como descendiente de un contenedor que pasa a
  // display:none, y el navegador lo cerraría solo (comportamiento nativo de
  // <dialog> en el top layer). Vive aquí, fuera de las tres, para que nunca
  // sea descendiente de un contenedor oculto.
  const [panelAbierto, setPanelAbierto] = useState(false);

  if (concentracion) {
    return (
      <div className="flex min-h-full flex-col">
        <BotonSalirConcentracion />
        <main id="contenido" className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <NavHamburguesa
        className={clasesVariante("hamburguesa", navDensidad)}
        onAbrirPreferencias={() => setPanelAbierto(true)}
      />
      <NavIconos
        className={clasesVariante("iconos", navDensidad)}
        onAbrirPreferencias={() => setPanelAbierto(true)}
      />
      <NavVisible
        className={clasesVariante("visible", navDensidad)}
        onAbrirPreferencias={() => setPanelAbierto(true)}
      />
      <main id="contenido" className="min-w-0 flex-1">
        {children}
      </main>
      <PreferenciasPanel abierto={panelAbierto} onCerrar={() => setPanelAbierto(false)} />
    </div>
  );
}
