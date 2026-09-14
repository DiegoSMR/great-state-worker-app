import type { NavDensidad } from "./preferencias";

/**
 * Clases Tailwind de visibilidad para una variante concreta de navegación,
 * dado el override manual del usuario (o `null` si no ha elegido y debe
 * aplicarse el default por breakpoint). Función pura — mismo cálculo tanto
 * en el primer render (con el valor ya resuelto server-side) como tras un
 * cambio manual en el cliente (specs/003-sistema-de-diseno/design.md).
 *
 * Sin override: mobile-first, default razonable por tamaño de pantalla
 * (Requisito 2.4) — móvil → hamburguesa, tablet → iconos, escritorio →
 * visible — resuelto solo con CSS, sin ningún hook de `matchMedia`.
 */
export function clasesVariante(variante: NavDensidad, override: NavDensidad | null): string {
  if (override) return override === variante ? "flex" : "hidden";

  const porDefecto: Record<NavDensidad, string> = {
    hamburguesa: "flex md:hidden",
    iconos: "hidden md:flex lg:hidden",
    visible: "hidden lg:flex",
  };
  return porDefecto[variante];
}
