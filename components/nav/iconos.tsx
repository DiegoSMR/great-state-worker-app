import type { SVGProps } from "react";

/**
 * Set mínimo de iconos inline (sin librería nueva — el stack no tiene una
 * adoptada, ver CONSTITUTION.md). Todos aceptan las props estándar de SVG
 * para poder pasar `aria-hidden`/`className` desde quien los usa.
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

export function IconoLibro(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M3.5 4.5c1.6-.8 3.6-.8 5 0v10.5c-1.4-.8-3.4-.8-5 0V4.5Z" />
      <path d="M16.5 4.5c-1.6-.8-3.6-.8-5 0v10.5c1.4-.8 3.4-.8 5 0V4.5Z" />
    </Base>
  );
}

export function IconoMarcador(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M5.5 3.5h9a.5.5 0 0 1 .5.5v12.3l-5-3-5 3V4a.5.5 0 0 1 .5-.5Z" />
    </Base>
  );
}

export function IconoApariencia(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="4" />
      <path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.1 4.9l-1.4 1.4M6.3 13.7l-1.4 1.4M15.1 15.1l-1.4-1.4M6.3 6.3 4.9 4.9" />
    </Base>
  );
}

export function IconoConcentracion(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M2.5 10S5.5 4.5 10 4.5 17.5 10 17.5 10 14.5 15.5 10 15.5 2.5 10 2.5 10Z" />
      <circle cx="10" cy="10" r="2.2" />
    </Base>
  );
}

export function IconoMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M3 6h14M3 10h14M3 14h14" />
    </Base>
  );
}

export function IconoCerrar(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M5 5l10 10M15 5 5 15" />
    </Base>
  );
}

export function IconoInformacion(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 9.2v4.3" />
      <circle cx="10" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconoPendiente(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M5 3.5h7l3 3v10a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5Z" />
      <path d="M12 3.5v3h3" />
    </Base>
  );
}

export function IconoPregunta(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="7" />
      <path d="M7.8 8.2a2.2 2.2 0 1 1 3.3 1.9c-.7.4-1.1.9-1.1 1.7v.4" />
      <circle cx="10" cy="14.3" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}
