"use client";

import { useProgresoLectura } from "./useProgresoLectura";

/**
 * Barra fina de progreso de lectura (Requisito 10.2) — color neutro
 * (`--borde`), nunca uno de los colores de estado, para no confundirse con
 * núcleo común/bookmark/revisión (Requisito 13). Puramente informativa:
 * `aria-hidden`, no lleva foco.
 */
export function ProgresoLectura() {
  const progreso = useProgresoLectura();

  return (
    <div aria-hidden="true" className="h-[3px] w-full bg-bg-secundario">
      <div
        className="h-full bg-borde motion-safe:transition-[width] motion-safe:duration-150"
        style={{ width: `${progreso * 100}%` }}
      />
    </div>
  );
}
