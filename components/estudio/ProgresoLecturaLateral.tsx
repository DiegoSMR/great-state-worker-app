"use client";

import { useProgresoLectura } from "./useProgresoLectura";

const MARCAS = [0, 25, 50, 75, 100];

/**
 * Raíl vertical de progreso de lectura — pedido por Diego probando la app
 * ("barra lateral donde se vea el porcentaje de la lección") para las dos
 * pestañas de documento largo (Texto oficial / Material oficial anotado,
 * ver `SeccionesConcepto`). Renderizado como hijo `flex` normal, junto a la
 * columna de lectura, con `position: sticky` para quedarse a la vista al
 * hacer scroll — a propósito NO `fixed` con una posición calculada desde el
 * viewport: `main` no está centrado sobre la ventana completa (`NavShell`
 * mete una barra de navegación a la izquierda), así que un `calc(50% + ...)`
 * relativo al viewport acababa solapado con el texto (bug real visto por
 * Diego). Como hijo `flex` en el propio flujo del documento, siempre cae al
 * lado correcto sea cual sea el ancho de esa barra de navegación. Solo desde
 * `lg:` — por debajo no hay margen fiable junto a la columna de 72ch
 * (`.medida-lectura-oficial`) sin solaparse con el texto (tablet portrait y
 * móvil se apoyan solo en `ProgresoLectura`, la barra horizontal ya
 * existente).
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
      className="sticky top-6 z-10 hidden h-[calc(100vh-3rem)] w-10 shrink-0 lg:block"
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
