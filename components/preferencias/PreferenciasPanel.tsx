"use client";

import { useEffect, useRef } from "react";
import { usePreferencias } from "./PreferenciasProvider";
import type {
  EstiloTexto,
  IntensidadManuscrito,
  NavDensidad,
  Tema,
  TamanoLetra,
} from "@/lib/preferencias";
import { IconoCerrar } from "@/components/nav/iconos";

const OPCIONES_TEMA: { valor: Tema; etiqueta: string }[] = [
  { valor: "claro", etiqueta: "Claro" },
  { valor: "oscuro", etiqueta: "Oscuro" },
  { valor: "papel", etiqueta: "Papel" },
];

const OPCIONES_TAMANO: { valor: TamanoLetra; etiqueta: string }[] = [
  { valor: "pequeno", etiqueta: "Pequeño" },
  { valor: "mediano", etiqueta: "Mediano" },
  { valor: "grande", etiqueta: "Grande" },
];

const OPCIONES_ESTILO_TEXTO: { valor: EstiloTexto; etiqueta: string }[] = [
  { valor: "digital", etiqueta: "Digital" },
  { valor: "manuscrito", etiqueta: "Manuscrito" },
];

const OPCIONES_INTENSIDAD: { valor: IntensidadManuscrito; etiqueta: string }[] = [
  { valor: "ligera", etiqueta: "Ligera" },
  { valor: "media", etiqueta: "Media" },
  { valor: "intensa", etiqueta: "Intensa" },
];

const OPCIONES_DENSIDAD: { valor: NavDensidad | null; etiqueta: string }[] = [
  { valor: null, etiqueta: "Automático" },
  { valor: "hamburguesa", etiqueta: "Colapsado" },
  { valor: "iconos", etiqueta: "Compacto" },
  { valor: "visible", etiqueta: "Expandido" },
];

/**
 * Panel de "Apariencia" (selector de tema, Requisito 3) + "Lectura"
 * (tamaño de letra, Requisito 8) — comparten panel porque responden a la
 * misma pregunta del usuario ("cómo se ve la app para mí"), ver
 * notas-de-diseno.md sección 5. Un único <dialog> compartido por las tres
 * variantes de navegación (evita triplicar la instancia).
 */
export function PreferenciasPanel({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  const {
    tema,
    setTema,
    tamanoLetra,
    setTamanoLetra,
    estiloTexto,
    setEstiloTexto,
    intensidadManuscrito,
    setIntensidadManuscrito,
    navDensidad,
    setNavDensidad,
  } = usePreferencias();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = dialogRef.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      // showModal() mueve el foco (y puede desplazar la página) según la
      // posición del <dialog> en el flujo normal del documento, incluso
      // aunque su CSS lo saque de flujo con position:fixed — en una página
      // larga de concepto, este panel vive al final del árbol, así que
      // showModal() puede saltar el scroll hasta el fondo. Lo revertimos en
      // la misma tarea síncrona, antes de que el navegador pinte el salto.
      const scrollY = window.scrollY;
      dialogo.showModal();
      window.scrollTo(0, scrollY);
    }
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogRef}
      className="panel-centrado"
      aria-label="Preferencias de apariencia y lectura"
      onClose={onCerrar}
    >
      <div className="flex items-center justify-between border-b border-borde px-5 py-4">
        <h2 className="text-base font-semibold">Preferencias</h2>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar preferencias"
          className="rounded-md p-2 text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
        >
          <IconoCerrar aria-hidden width="1.3em" height="1.3em" />
        </button>
      </div>

      <div className="space-y-6 px-5 py-5">
        <fieldset>
          <legend className="text-sm font-medium text-texto-primario">Apariencia</legend>
          <div role="radiogroup" aria-label="Tema" className="mt-2 flex gap-2">
            {OPCIONES_TEMA.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                role="radio"
                aria-checked={tema === opcion.valor}
                onClick={() => setTema(opcion.valor)}
                className={
                  tema === opcion.valor
                    ? "flex-1 rounded-md border border-texto-primario bg-bg-secundario px-3 py-2 text-sm font-medium text-texto-primario"
                    : "flex-1 rounded-md border border-borde px-3 py-2 text-sm text-texto-secundario hover:text-texto-primario"
                }
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-texto-primario">Navegación — densidad del menú</legend>
          <div role="radiogroup" aria-label="Densidad del menú de navegación" className="mt-2 grid grid-cols-2 gap-2">
            {OPCIONES_DENSIDAD.map((opcion) => (
              <button
                key={opcion.etiqueta}
                type="button"
                role="radio"
                aria-checked={navDensidad === opcion.valor}
                onClick={() => setNavDensidad(opcion.valor)}
                className={
                  navDensidad === opcion.valor
                    ? "rounded-md border border-texto-primario bg-bg-secundario px-3 py-2 text-sm font-medium text-texto-primario"
                    : "rounded-md border border-borde px-3 py-2 text-sm text-texto-secundario hover:text-texto-primario"
                }
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-texto-primario">Lectura — tamaño de letra</legend>
          <div role="radiogroup" aria-label="Tamaño de letra" className="mt-2 flex gap-2">
            {OPCIONES_TAMANO.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                role="radio"
                aria-checked={tamanoLetra === opcion.valor}
                onClick={() => setTamanoLetra(opcion.valor)}
                className={
                  tamanoLetra === opcion.valor
                    ? "flex-1 rounded-md border border-texto-primario bg-bg-secundario px-3 py-2 text-sm font-medium text-texto-primario"
                    : "flex-1 rounded-md border border-borde px-3 py-2 text-sm text-texto-secundario hover:text-texto-primario"
                }
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-texto-primario">Lectura — estilo de texto</legend>
          <div role="radiogroup" aria-label="Estilo de texto" className="mt-2 flex gap-2">
            {OPCIONES_ESTILO_TEXTO.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                role="radio"
                aria-checked={estiloTexto === opcion.valor}
                onClick={() => setEstiloTexto(opcion.valor)}
                className={
                  estiloTexto === opcion.valor
                    ? "flex-1 rounded-md border border-texto-primario bg-bg-secundario px-3 py-2 text-sm font-medium text-texto-primario"
                    : "flex-1 rounded-md border border-borde px-3 py-2 text-sm text-texto-secundario hover:text-texto-primario"
                }
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>

          {/* Pop-in: solo tiene sentido con "Manuscrito" seleccionado — con
              "Digital" no se renderiza en absoluto (notas-de-diseno.md §15),
              no solo se deshabilita. */}
          {estiloTexto === "manuscrito" && (
            <div className="mt-3">
              <span className="text-sm text-texto-secundario">Intensidad</span>
              <div role="radiogroup" aria-label="Intensidad del estilo manuscrito" className="mt-2 flex gap-2">
                {OPCIONES_INTENSIDAD.map((opcion) => (
                  <button
                    key={opcion.valor}
                    type="button"
                    role="radio"
                    aria-checked={intensidadManuscrito === opcion.valor}
                    onClick={() => setIntensidadManuscrito(opcion.valor)}
                    className={
                      intensidadManuscrito === opcion.valor
                        ? "flex-1 rounded-md border border-texto-primario bg-bg-secundario px-3 py-2 text-sm font-medium text-texto-primario"
                        : "flex-1 rounded-md border border-borde px-3 py-2 text-sm text-texto-secundario hover:text-texto-primario"
                    }
                  >
                    {opcion.etiqueta}
                  </button>
                ))}
              </div>
            </div>
          )}
        </fieldset>
      </div>
    </dialog>
  );
}
