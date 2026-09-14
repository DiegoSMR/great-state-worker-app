"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, esNavItemActivo } from "@/lib/nav-items";
import { usePreferencias } from "@/components/preferencias/PreferenciasProvider";
import { IconoApariencia, IconoConcentracion, IconoLibro, IconoMarcador } from "./iconos";

const ICONOS = { libro: IconoLibro, marcador: IconoMarcador };

/** Densidad "expanded": rail fijo expandido, icono + etiqueta de texto (escritorio por defecto). */
export function NavVisible({
  className,
  onAbrirPreferencias,
}: {
  className: string;
  onAbrirPreferencias: () => void;
}) {
  const pathname = usePathname();
  const { toggleConcentracion } = usePreferencias();

  return (
    // sticky + h-screen: ver NavIconos.tsx — evita que el rail se estire a
    // la altura del contenido en una página de concepto larga.
    <div className={`${className} sticky top-0 h-screen w-60 shrink-0 flex-col border-r border-borde bg-bg-primario`}>
      <div className="flex h-full flex-col gap-1 p-4">
        <Link href="/" className="mb-3 px-2 text-lg font-semibold text-texto-primario">
          Great State Worker
        </Link>

        <nav aria-label="Secciones de la app" className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icono = ICONOS[item.icono];
            const activo = esNavItemActivo(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activo ? "page" : undefined}
                className={
                  activo
                    ? "flex items-center gap-3 rounded-md bg-bg-secundario px-3 py-2.5 text-texto-primario"
                    : "flex items-center gap-3 rounded-md px-3 py-2.5 text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
                }
              >
                <Icono aria-hidden width="1.2em" height="1.2em" />
                {item.etiqueta}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-borde pt-3">
          <button
            type="button"
            onClick={toggleConcentracion}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
          >
            <IconoConcentracion aria-hidden width="1.2em" height="1.2em" />
            Concentración
          </button>
          <button
            type="button"
            onClick={onAbrirPreferencias}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
          >
            <IconoApariencia aria-hidden width="1.2em" height="1.2em" />
            Apariencia
          </button>
        </div>
      </div>
    </div>
  );
}
