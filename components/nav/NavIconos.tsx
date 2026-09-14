"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, esNavItemActivo } from "@/lib/nav-items";
import { usePreferencias } from "@/components/preferencias/PreferenciasProvider";
import { IconoApariencia, IconoConcentracion, IconoLibro, IconoMarcador, IconoPregunta } from "./iconos";

const ICONOS = { libro: IconoLibro, marcador: IconoMarcador, pregunta: IconoPregunta };

/** Densidad "compact": rail fijo siempre visible, solo iconos (tablet por defecto). */
export function NavIconos({
  className,
  onAbrirPreferencias,
}: {
  className: string;
  onAbrirPreferencias: () => void;
}) {
  const pathname = usePathname();
  const { toggleConcentracion } = usePreferencias();

  return (
    // sticky + h-screen: sin esto, en una página de concepto muy larga el
    // rail se estira a la altura del contenido (align-items:stretch del
    // flex row del padre) y sus botones de abajo (mt-auto) quedan a miles
    // de píxeles de profundidad, fuera de la pantalla — justo lo que el
    // Requisito 2 (navegación persistente) pide evitar.
    <div className={`${className} sticky top-0 h-screen w-16 shrink-0 flex-col border-r border-borde bg-bg-primario`}>
      <div className="flex h-full flex-col items-center gap-1 py-4">
        <Link href="/" aria-label="Ir a inicio" className="mb-3 rounded-md p-2 text-texto-primario hover:bg-bg-secundario">
          GSW
        </Link>

        <nav aria-label="Secciones de la app" className="flex flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icono = ICONOS[item.icono];
            const activo = esNavItemActivo(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.etiqueta}
                aria-current={activo ? "page" : undefined}
                title={item.etiqueta}
                className={
                  activo
                    ? "rounded-md bg-bg-secundario p-2.5 text-texto-primario"
                    : "rounded-md p-2.5 text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
                }
              >
                <Icono aria-hidden width="1.3em" height="1.3em" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={toggleConcentracion}
            aria-label="Modo concentración"
            title="Modo concentración"
            className="rounded-md p-2.5 text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
          >
            <IconoConcentracion aria-hidden width="1.3em" height="1.3em" />
          </button>
          <button
            type="button"
            onClick={onAbrirPreferencias}
            aria-label="Apariencia"
            title="Apariencia"
            className="rounded-md p-2.5 text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
          >
            <IconoApariencia aria-hidden width="1.3em" height="1.3em" />
          </button>
        </div>
      </div>
    </div>
  );
}
