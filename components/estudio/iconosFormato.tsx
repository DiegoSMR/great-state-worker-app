import type { SVGProps } from "react";

/**
 * Iconos del panel de formato de anotación (Requisito 1.2, extensión
 * 2026-09-17 de specs/020-anotaciones-personales-lectura) — archivo hermano
 * de `components/nav/iconos.tsx`, mismo `Base` (viewBox 0 0 20 20, trazo
 * `currentColor`, sin relleno salvo la excepción documentada abajo) para no
 * mezclar iconos de navegación con iconos de edición de contenido. Sin
 * librería de iconos nueva (ver comentario en `nav/iconos.tsx`: el stack no
 * tiene ninguna adoptada).
 */

function Base({ children, ...props }: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1.1em"
      height="1.1em"
      {...props}
    >
      {children}
    </svg>
  );
}

/**
 * Única excepción a "solo trazo" del set: la "B" de Negrita se pinta rellena
 * (glifo de texto, no un trazo geométrico) porque es la convención universal
 * para representar negrita — un trazo fino de la propia letra "B" no se lee
 * como negrita a tamaño de icono (design.md, extensión 2026-09-17).
 */
export function IconoNegrita(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <text x="10" y="14.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">
        B
      </text>
    </Base>
  );
}

export function IconoSubrayado(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M6 4v6a4 4 0 0 0 8 0V4" />
      <path d="M5 16h10" />
    </Base>
  );
}

/** Rotulador/marcador en trazo geométrico (nunca relleno, a diferencia del `IconoMarcador` de navegación). */
export function IconoResaltar(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12.2 3.3 16.7 7.8 9.2 15.3 4.3 16.2 5.2 11.3 12.2 3.3Z" />
      <path d="M9.7 5.8 14.2 10.3" />
      <path d="M3.5 17.7h4.5" />
    </Base>
  );
}

export function IconoQuitarFormato(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M7.3 13.6 13.7 7.2a1.5 1.5 0 0 1 2.1 0l1.4 1.4a1.5 1.5 0 0 1 0 2.1L10.8 17H7.3v-3.4Z" />
      <path d="M11.2 9.5 14.7 13" />
    </Base>
  );
}

/** Lápiz — botón "Modo edición" cuando `aria-pressed` es `false`. */
export function IconoModoEdicion(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4.3 15.7 4.8 12.2 13 4l3 3-8.2 8.2-3.5.5Z" />
      <path d="M11 6l3 3" />
    </Base>
  );
}

/** Check — el mismo botón "Modo edición"/"Salir de modo edición" cuando `aria-pressed` es `true`. */
export function IconoModoEdicionActivo(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4.5 10.5 8.2 14.2 15.5 6.5" />
    </Base>
  );
}

/** Flecha circular — "Restablecer al texto oficial". */
export function IconoRestablecer(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M15.6 5.6A7 7 0 1 0 17 10" />
      <path d="M17.7 3.3v4.3h-4.3" />
    </Base>
  );
}
