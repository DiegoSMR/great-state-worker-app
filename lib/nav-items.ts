export type NavIconoId = "libro" | "marcador";

export type NavItem = {
  href: string;
  etiqueta: string;
  icono: NavIconoId;
};

/**
 * Catálogo de entradas de navegación. Estudio y Marcadores son las
 * entradas reales de v1; Pruebas, Flashcards y Planificador
 * (PRODUCT-VISION.md §4) se añaden aquí cuando existan — NavShell y sus
 * tres variantes no necesitan cambios, solo crece esta lista (Requisito 2.8).
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/estudio", etiqueta: "Estudio", icono: "libro" },
  { href: "/estudio/marcadores", etiqueta: "Marcadores", icono: "marcador" },
];

/**
 * Un item se marca activo si la ruta actual coincide exactamente o es una
 * subruta suya — con cuidado de que "/estudio" no se marque activo estando
 * en "/estudio/marcadores" (que es su propia entrada, Requisito 2.7).
 */
export function esNavItemActivo(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  const otrasRutasDelMismoPrefijo = NAV_ITEMS.some(
    (item) => item.href !== href && item.href.startsWith(`${href}/`) && pathname.startsWith(item.href)
  );
  if (otrasRutasDelMismoPrefijo) return false;
  return pathname.startsWith(`${href}/`);
}
