"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { guardarPosicion, leerPosicion } from "@/lib/progreso-lectura";
import { ProgresoLectura } from "./ProgresoLectura";

const SECCIONES = [
  { id: "texto-oficial", etiqueta: "Texto oficial" },
  { id: "material-adaptado", etiqueta: "Material adaptado" },
  { id: "resumen", etiqueta: "Resumen" },
] as const;

/**
 * Tabs + scrollspy entre las tres partes del contenido de un concepto
 * (Requisito 4), con restauración de posición de scroll y aviso "continuar
 * leyendo" (Requisito 10). Recibe el contenido ya renderizado en servidor
 * (ReactMarkdown, FuenteNormativa) como `ReactNode` — evita que este Client
 * Component tenga que importar lib/contenido.ts (que usa `fs`, no
 * disponible en el bundle de cliente).
 */
export function SeccionesConcepto({
  conceptoId,
  textoOficial,
  materialAdaptado,
  esquema,
  resumenExtenso,
  fuenteNormativa,
}: {
  conceptoId: string;
  textoOficial: ReactNode;
  materialAdaptado: ReactNode;
  esquema: ReactNode;
  resumenExtenso: ReactNode;
  fuenteNormativa: ReactNode;
}) {
  const [seccionActiva, setSeccionActiva] = useState<string>("texto-oficial");
  // Siempre false en el primer render (server y cliente coinciden — no hay
  // localStorage en servidor) — se corrige en el efecto de abajo, ya
  // montados en el cliente, para no producir un mismatch de hidratación.
  const [avisoContinuar, setAvisoContinuar] = useState(false);
  const timeoutGuardado = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restaurar posición de scroll al montar (Requisito 10.1) — sin salto
  // brusco perceptible ni diálogo de confirmación. localStorage solo existe
  // en el cliente, así que esto no puede resolverse durante el render (ni
  // en servidor ni como estado inicial coherente con la SSR) — leerlo y
  // aplicar el estado derivado aquí, en un efecto, es el patrón correcto
  // para sincronizar con un sistema externo al montar (no hay forma de
  // evitar el setState-en-efecto sin introducir un mismatch de hidratación).
  useEffect(() => {
    // Desactiva la restauración de scroll nativa del navegador en recargas
    // — la nuestra (posición por concepto) es la única fuente de verdad,
    // para que no compitan entre sí.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const posicion = leerPosicion(conceptoId);
    if (posicion !== null && posicion > 40) {
      window.scrollTo({ top: posicion, behavior: "instant" });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura de localStorage al montar, no hay forma de resolverlo antes sin mismatch de hidratación (ver comentario arriba).
      setAvisoContinuar(true);
    }
  }, [conceptoId]);

  // El aviso desaparece a los 4s o al primer scroll manual, lo que ocurra antes.
  useEffect(() => {
    if (!avisoContinuar) return;
    const temporizador = setTimeout(() => setAvisoContinuar(false), 4000);

    function alPrimerScroll() {
      setAvisoContinuar(false);
    }
    // Margen antes de escuchar: la propia restauración de posición (efecto
    // de arriba) dispara su propio evento "scroll" — sin este margen, ese
    // scroll programático se confundiría con un scroll manual del usuario y
    // el aviso desaparecería antes de que le diera tiempo a verlo.
    const esperaAntesDeEscuchar = setTimeout(() => {
      window.addEventListener("scroll", alPrimerScroll, { once: true, passive: true });
    }, 150);

    return () => {
      clearTimeout(temporizador);
      clearTimeout(esperaAntesDeEscuchar);
      window.removeEventListener("scroll", alPrimerScroll);
    };
  }, [avisoContinuar]);

  // Guardar posición de scroll (debounced ~500ms).
  useEffect(() => {
    function alScroll() {
      if (timeoutGuardado.current) clearTimeout(timeoutGuardado.current);
      timeoutGuardado.current = setTimeout(() => {
        guardarPosicion(conceptoId, window.scrollY);
      }, 500);
    }
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScroll);
      if (timeoutGuardado.current) clearTimeout(timeoutGuardado.current);
    };
  }, [conceptoId]);

  // Scrollspy: qué sección está visible ahora mismo (Requisito 4.1).
  useEffect(() => {
    const elementos = SECCIONES.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elementos.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setSeccionActiva(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 bg-bg-primario sm:mx-0">
        <nav aria-label="Secciones del concepto" className="flex gap-1 overflow-x-auto border-b border-borde px-4 sm:px-0">
          {SECCIONES.map((seccion) => (
            <a
              key={seccion.id}
              href={`#${seccion.id}`}
              aria-current={seccionActiva === seccion.id ? "true" : undefined}
              className={
                seccionActiva === seccion.id
                  ? "whitespace-nowrap border-b-2 border-texto-primario px-3 py-2.5 text-sm font-medium text-texto-primario"
                  : "whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-texto-secundario hover:text-texto-primario"
              }
            >
              {seccion.etiqueta}
            </a>
          ))}
        </nav>
        <ProgresoLectura />
      </div>

      {avisoContinuar && (
        <p role="status" className="mt-3 px-4 text-sm text-texto-secundario sm:px-0">
          Continuando desde donde lo dejaste.
        </p>
      )}

      <div className="mt-6 space-y-10 px-4 sm:px-0">
        <section
          id="texto-oficial"
          className="medida-lectura-oficial scroll-mt-28 rounded-md border border-borde bg-bg-secundario p-4 sm:p-6"
        >
          <h2 className="text-lg font-medium">Texto oficial</h2>
          <div className="contenido-lectura mt-3">{textoOficial}</div>
          {fuenteNormativa}
        </section>

        <section id="material-adaptado" className="medida-lectura scroll-mt-28">
          <h2 className="text-lg font-medium">Material adaptado</h2>
          <div className="contenido-lectura mt-3">{materialAdaptado}</div>
        </section>

        <section id="resumen" className="medida-lectura scroll-mt-28 border-l-4 border-borde pl-4">
          <h2 className="text-lg font-medium">Resumen</h2>
          <div id="esquema" className="mt-4 scroll-mt-28">
            <h3 className="text-base font-medium">Esquema</h3>
            <div className="contenido-lectura mt-2">{esquema}</div>
          </div>
          <div id="resumen-extenso" className="mt-6 scroll-mt-28">
            <h3 className="text-base font-medium">Resumen extenso</h3>
            <div className="contenido-lectura mt-2">{resumenExtenso}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
