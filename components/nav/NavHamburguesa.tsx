"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, esNavItemActivo } from "@/lib/nav-items";
import { usePreferencias } from "@/components/preferencias/PreferenciasProvider";
import { IconoApariencia, IconoCerrar, IconoConcentracion, IconoMenu, IconoLibro, IconoMarcador } from "./iconos";

const ICONOS = { libro: IconoLibro, marcador: IconoMarcador };

/** Densidad "collapsed": icono fijo arriba + overlay que se abre sobre el contenido (móvil por defecto). */
export function NavHamburguesa({
  className,
  onAbrirPreferencias,
}: {
  className: string;
  onAbrirPreferencias: () => void;
}) {
  const pathname = usePathname();
  const { toggleConcentracion } = usePreferencias();
  const [abierto, setAbierto] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = dialogRef.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      // Ver PreferenciasPanel.tsx: showModal() puede saltar el scroll de la
      // página según la posición del <dialog> en el DOM — se revierte por
      // seguridad aunque este overlay viva cerca del inicio del árbol.
      const scrollY = window.scrollY;
      dialogo.showModal();
      window.scrollTo(0, scrollY);
    }
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <div className={className}>
      <header className="flex w-full items-center justify-between border-b border-borde bg-bg-primario px-4 py-3">
        <Link href="/" className="font-semibold text-texto-primario">
          Great State Worker
        </Link>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú de navegación"
          className="rounded-md p-2 text-texto-primario hover:bg-bg-secundario"
        >
          <IconoMenu aria-hidden width="1.3em" height="1.3em" />
        </button>
      </header>

      <dialog
        ref={dialogRef}
        className="panel-lateral"
        aria-label="Menú de navegación"
        onClose={() => setAbierto(false)}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Menú</span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar menú"
              className="rounded-md p-2 text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
            >
              <IconoCerrar aria-hidden width="1.3em" height="1.3em" />
            </button>
          </div>

          <nav aria-label="Secciones de la app" className="mt-4 flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icono = ICONOS[item.icono];
              const activo = esNavItemActivo(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setAbierto(false)}
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
              onClick={() => {
                setAbierto(false);
                onAbrirPreferencias();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
            >
              <IconoApariencia aria-hidden width="1.2em" height="1.2em" />
              Apariencia
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
