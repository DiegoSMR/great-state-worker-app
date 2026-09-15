"use client";

import { useProgresoLectura } from "./useProgresoLectura";

const MARCAS = [0, 25, 50, 75, 100];

/**
 * Raíl vertical de progreso de lectura — pedido por Diego probando la app
 * ("barra lateral donde se vea el porcentaje de la lección") para las dos
 * pestañas de documento largo (Texto oficial / Material oficial anotado,
 * ver `SeccionesConcepto`). `fixed` respecto a la ventana, anclado al margen
 * derecho de la columna de lectura centrada (`max-w-3xl` en
 * app/estudio/tema/[conceptoId]/page.tsx) en vez de vivir en el flujo:
 * dentro de esos 768px ya no queda aire para un raíl junto a un documento de
 * 72ch (`.medida-lectura-oficial`). Solo desde `lg:` — por debajo no hay
 * margen fiable fuera de esa columna sin solaparse con el texto (tablet
 * portrait y móvil se apoyan solo en `ProgresoLectura`, la barra horizontal
 * ya existente).
 *
 * Igual que `ProgresoLectura`: puramente informativo (`aria-hidden`), color
 * neutro (`--borde`), nunca uno de los colores de estado.
 */
export function ProgresoLecturaLateral() {
  const progreso = useProgresoLectura();
  const porcentaje = Math.round(progreso * 100);

  return (
    <div
      aria-hidden="true"
      className="fixed top-6 bottom-6 z-10 hidden w-10 lg:block"
      style={{ left: "calc(50% + 24rem + 1.5rem)" }}
    >
      <div className="relative mx-auto h-full w-px bg-borde">
        {MARCAS.map((marca) => (
          <span
            key={marca}
            className="absolute left-1/2 h-1.5 w-1.5 rounded-full bg-borde"
            style={{ top: `${marca}%`, transform: "translate(-50%, -50%)" }}
          />
        ))}
        <span
          className="absolute left-1/2 whitespace-nowrap rounded bg-bg-primario px-1 text-xs tabular-nums text-texto-secundario motion-safe:transition-[top] motion-safe:duration-150"
          style={{ top: `${progreso * 100}%`, transform: "translate(-50%, -50%)" }}
        >
          {porcentaje}%
        </span>
      </div>
    </div>
  );
}
