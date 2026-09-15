"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { guardarPosicion, leerPosicion } from "@/lib/progreso-lectura";
import { borrarAnotacion, calcularHash, guardarAnotacion, leerAnotacion } from "@/lib/anotaciones-lectura";
import { ProgresoLectura } from "./ProgresoLectura";
import { ProgresoLecturaLateral } from "./ProgresoLecturaLateral";
import { BarraFormato } from "./BarraFormato";

const SECCIONES = [
  { id: "texto-oficial", etiqueta: "Texto oficial" },
  { id: "material-oficial-anotado", etiqueta: "Material oficial anotado" },
  { id: "material-adaptado", etiqueta: "Material adaptado" },
  { id: "resumen", etiqueta: "Resumen" },
] as const;

/**
 * Ids de las 4 secciones anotables (Requisito 2, specs/020) — cada una es
 * el `div.contenido-lectura` seleccionable con el que opera `BarraFormato`
 * (Range API manual, nunca `contentEditable` — ver comentario en el propio
 * `<div>` de abajo sobre por qué) y la clave de sección usada en
 * `lib/anotaciones-lectura.ts`. No son 1:1 con los 4 ids de `SECCIONES`
 * (pestañas, arriba): "resumen" agrupa dos secciones anotables
 * independientes (esquema y resumen extenso), y "texto-oficial" tiene DOS
 * pestañas propias — "Texto oficial" (siempre limpio, sin ref ni anotación)
 * y "Material oficial anotado" (la única que usa la clave anotable
 * `texto-oficial`) — feedback directo de Diego probando la app: quiere el
 * texto oficial siempre intacto en su propia pestaña, y su versión anotada
 * en una pestaña aparte, no alternando en el mismo sitio con un checkbox.
 */
type SeccionAnotableId = "texto-oficial" | "material-adaptado" | "esquema" | "resumen-extenso";

/**
 * Pestañas entre las cuatro partes del contenido de un concepto (Requisito
 * 4) — solo la pestaña activa está en el DOM visible, el resto se oculta con
 * `hidden` —, con restauración de posición de scroll y aviso "continuar
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

  // Modo edición de anotaciones (Requisito 1) — un ref por sección anotable,
  // para leer/escribir su `innerHTML` directamente sin pasar por el árbol
  // de React (que no es dueño de este contenido una vez montado, ver
  // comentario en lib/anotaciones-lectura.ts sobre el porqué). Se usan en
  // Requisito 2 para restaurar/guardar anotaciones.
  const [modoEdicion, setModoEdicion] = useState(false);
  // Por defecto "con mis anotaciones" (Requisito 3.2) — se reinicia a este
  // valor en cada carga de página a propósito, no se persiste entre
  // sesiones (requirements.md, Fuera de alcance — mismo criterio que modo
  // concentración). Solo gobierna material-adaptado/esquema/resumen-extenso:
  // el texto oficial anotado tiene su propia pestaña siempre visible (ver
  // comentario sobre `SeccionAnotableId` más abajo), no depende de este
  // checkbox.
  const [mostrarAnotaciones, setMostrarAnotaciones] = useState(true);
  const refTextoOficial = useRef<HTMLDivElement>(null);
  const refMaterialAdaptado = useRef<HTMLDivElement>(null);
  const refEsquema = useRef<HTMLDivElement>(null);
  const refResumenExtenso = useRef<HTMLDivElement>(null);

  // HTML tal cual vino del servidor (Requisito 2.3/3.3, capturado al montar
  // antes de restaurar ninguna anotación) y última versión anotada válida
  // conocida (Requisito 2.2/3.2) — por sección. No son estado de React a
  // propósito: se leen/escriben imperativamente sobre el DOM real (ver
  // comentario más arriba sobre por qué React no es dueño de este
  // contenido), así que vivir en un `ref` evita re-renders innecesarios.
  const htmlOriginalRef = useRef<Partial<Record<SeccionAnotableId, string>>>({});
  const htmlAnotadoRef = useRef<Partial<Record<SeccionAnotableId, string>>>({});

  function elementoDeSeccion(seccionId: SeccionAnotableId): HTMLDivElement | null {
    switch (seccionId) {
      case "texto-oficial":
        return refTextoOficial.current;
      case "material-adaptado":
        return refMaterialAdaptado.current;
      case "esquema":
        return refEsquema.current;
      case "resumen-extenso":
        return refResumenExtenso.current;
    }
  }

  // Sanitiza, calcula el hash del texto plano actual y persiste (Requisito
  // 2.1) — se llama justo después de cada acción de BarraFormato (no hay
  // escritura libre de texto que guardar con debounce: ver comentario sobre
  // por qué estas secciones ya no son `contentEditable`).
  function guardarSeccion(seccionId: SeccionAnotableId) {
    const el = elementoDeSeccion(seccionId);
    if (!el) return;
    const hash = calcularHash(el.textContent ?? "");
    guardarAnotacion(conceptoId, seccionId, el.innerHTML, hash);
    htmlAnotadoRef.current[seccionId] = el.innerHTML;
  }

  // Qué sección contiene la selección actual (`data-seccion-id` del
  // contenedor más cercano) — para saber, tras pulsar un botón de
  // BarraFormato, qué anotación guardar (la propia acción de formato no
  // dispara un evento "input" nativo, al ser una manipulación manual del
  // DOM vía Range API, así que hace falta guardar explícitamente aquí).
  function seccionDesdeSeleccionActual(): SeccionAnotableId | null {
    let nodo: Node | null = window.getSelection()?.anchorNode ?? null;
    while (nodo) {
      if (nodo instanceof HTMLElement && nodo.dataset.seccionId) {
        return nodo.dataset.seccionId as SeccionAnotableId;
      }
      nodo = nodo.parentNode;
    }
    return null;
  }

  // Solo guarda (y por tanto solo deja aplicar formato) cuando la selección
  // actual cae dentro de una sección anotable de verdad — `BarraFormato`
  // llama a esto ANTES de tocar el DOM (ver `puedeFormatear` que le pasamos
  // más abajo), así un texto seleccionado fuera de cualquier
  // `data-seccion-id` (la sección "Texto oficial" limpia, sin ref, no tiene
  // ninguno) nunca llega a envolverse en `<strong>`/`<u>`/`<mark>`: el texto
  // oficial debe quedar intacto siempre, solo su copia en "Material oficial
  // anotado" es editable (feedback directo de Diego).
  function seccionAnotableParaFormato(): SeccionAnotableId | null {
    return seccionDesdeSeleccionActual();
  }

  function alFormatear(seccionId: SeccionAnotableId) {
    guardarSeccion(seccionId);
  }

  // Restaurar anotaciones al montar (Requisito 2.2/2.3): por cada sección,
  // guarda el HTML original tal cual vino del servidor y, si hay una
  // anotación guardada cuyo hash coincide con el texto actual, la aplica;
  // si el hash no coincide (el contenido cambió desde que se guardó), la
  // descarta de localStorage en vez de mezclarla con el contenido nuevo.
  //
  // La captura de `htmlOriginalRef` está protegida con un `if` (solo se
  // guarda si todavía no hay nada ahí): en desarrollo, StrictMode invoca
  // este efecto dos veces sobre el mismo DOM sin desmontar de verdad entre
  // medias (no hay cleanup que lo evite) — sin este guard, la segunda
  // pasada capturaría como "original" el HTML ya anotado que la primera
  // pasada acababa de escribir, perdiendo la vista limpia para siempre
  // (bug real encontrado verificando Requisito 3 en el navegador).
  useEffect(() => {
    function restaurar(seccionId: SeccionAnotableId, el: HTMLDivElement | null) {
      if (!el) return;
      if (htmlOriginalRef.current[seccionId] === undefined) {
        htmlOriginalRef.current[seccionId] = el.innerHTML;
      }
      const anotacion = leerAnotacion(conceptoId, seccionId);
      if (!anotacion) return;
      const hashActual = calcularHash(el.textContent ?? "");
      if (anotacion.hashOriginal === hashActual) {
        htmlAnotadoRef.current[seccionId] = anotacion.html;
        el.innerHTML = anotacion.html;
      } else {
        borrarAnotacion(conceptoId, seccionId);
      }
    }
    restaurar("texto-oficial", refTextoOficial.current);
    restaurar("material-adaptado", refMaterialAdaptado.current);
    restaurar("esquema", refEsquema.current);
    restaurar("resumen-extenso", refResumenExtenso.current);
  }, [conceptoId]);

  // Alternar "con/sin anotaciones" (Requisito 3): por cada sección, cambia
  // entre el HTML original (vista limpia) y el HTML anotado ya restaurado
  // arriba — sin volver a pedir datos al servidor ni duplicar el árbol de
  // Markdown. Es un control de visualización, no de borrado: no toca
  // localStorage ni los refs, solo decide cuál de los dos ya-disponibles se
  // pinta. También se aplica en el montaje (mismo efecto, misma pasada que
  // el resto de renders): si no hay versión anotada, no cambia nada.
  //
  // "texto-oficial" queda fuera del checkbox a propósito: su pestaña
  // "Material oficial anotado" siempre muestra la versión anotada (o la
  // original si todavía no hay ninguna) — es la propia pestaña la que decide
  // "limpio vs. anotado" para el texto oficial, no este toggle compartido.
  useEffect(() => {
    function aplicarVista(seccionId: SeccionAnotableId, el: HTMLDivElement | null, mostrar: boolean) {
      if (!el) return;
      const original = htmlOriginalRef.current[seccionId];
      // Todavía no capturado (el efecto de restauración de arriba corre
      // antes, en el mismo commit de montaje, pero por claridad se protege
      // igual frente a cualquier reordenación futura de los efectos).
      if (original === undefined) return;
      const anotado = htmlAnotadoRef.current[seccionId];
      el.innerHTML = mostrar ? (anotado ?? original) : original;
    }
    aplicarVista("texto-oficial", refTextoOficial.current, true);
    aplicarVista("material-adaptado", refMaterialAdaptado.current, mostrarAnotaciones);
    aplicarVista("esquema", refEsquema.current, mostrarAnotaciones);
    aplicarVista("resumen-extenso", refResumenExtenso.current, mostrarAnotaciones);
  }, [mostrarAnotaciones]);

  // Activar el modo edición fuerza la vista a "con mis anotaciones"
  // (Requisito 3.5) — no tiene sentido editar sin verlas. Se decide en el
  // propio manejador del botón (no en un efecto que reaccione a
  // `modoEdicion`): un `setState` síncrono dentro de un efecto solo para
  // reaccionar a otro estado local de React provoca un render en cascada
  // evitable — aquí ya sabemos en el momento del click qué dos estados
  // deben cambiar juntos.
  function alternarModoEdicion() {
    const nuevoModoEdicion = !modoEdicion;
    setModoEdicion(nuevoModoEdicion);
    if (nuevoModoEdicion) setMostrarAnotaciones(true);
  }

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
    if (posicion !== null && posicion.scrollY > 40) {
      // La pestaña guardada puede no ser la activa por defecto ("texto
      // oficial") — si no coincide, hay que cambiar de pestaña primero (lo
      // que oculta/muestra secciones y cambia la altura de la página) antes
      // de hacer scroll, o el scrollY guardado no correspondería a nada.
      if (posicion.seccion && SECCIONES.some((s) => s.id === posicion.seccion)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura de localStorage al montar, no hay forma de resolverlo antes sin mismatch de hidratación (ver comentario arriba).
        setSeccionActiva(posicion.seccion);
      }
      // requestAnimationFrame en vez de scrollTo directo: si el cambio de
      // pestaña de arriba disparó un re-render, hay que esperar a que se
      // pinte esa pestaña (con su altura real) antes de hacer scroll —
      // scrollear en el mismo tick del efecto lo haría contra el DOM
      // todavía mostrando la pestaña anterior.
      requestAnimationFrame(() => {
        window.scrollTo({ top: posicion.scrollY, behavior: "instant" });
      });
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

  // Guardar posición de scroll (debounced ~500ms), junto con la pestaña
  // activa en ese momento (necesaria para restaurar bien, ver efecto de
  // montaje más arriba). Depende también de `seccionActiva`: al cambiar de
  // pestaña hay que volver a enganchar el listener para que capture el valor
  // correcto en el cierre, no uno obsoleto.
  useEffect(() => {
    function alScroll() {
      if (timeoutGuardado.current) clearTimeout(timeoutGuardado.current);
      timeoutGuardado.current = setTimeout(() => {
        guardarPosicion(conceptoId, window.scrollY, seccionActiva);
      }, 500);
    }
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScroll);
      if (timeoutGuardado.current) clearTimeout(timeoutGuardado.current);
    };
  }, [conceptoId, seccionActiva]);

  // Pestañas de verdad (Requisito 4, ajustado tras probar la app: antes esto
  // era scrollspy — las 4 secciones montadas a la vez en una página larga, y
  // la pestaña activa solo reflejaba cuál estaba a la vista al hacer scroll.
  // Diego pidió que seleccionar una pestaña oculte el resto del contenido,
  // no que siga siendo un ancla dentro de la misma página — así que cada
  // sección se oculta con `hidden` salvo la activa (ver JSX más abajo) y
  // cambiar de pestaña es una acción explícita de click, no algo que dependa
  // de la posición de scroll.
  function seleccionarSeccion(id: string) {
    setSeccionActiva(id);
    // Cada pestaña empieza arriba del todo — no tiene sentido conservar el
    // scroll de la pestaña anterior cuando su contenido ya no está a la vista.
    window.scrollTo({ top: 0, behavior: "instant" });
    // `ProgresoLectura` solo recalcula en scroll/resize; el cambio de
    // pestaña sustituye el contenido sin disparar ninguno de los dos, así
    // que fuerza un recálculo con la nueva altura de página.
    window.dispatchEvent(new Event("resize"));
    // Guarda ya la pestaña elegida (con scroll 0): si el usuario navega fuera
    // justo después de cambiar de pestaña, sin llegar a hacer scroll, debe
    // "continuar" en esta pestaña y no en la anterior.
    guardarPosicion(conceptoId, 0, id);
  }

  // Contorno discontinuo que marca, en modo edición, dónde se puede
  // seleccionar texto para anotar (Requisito 1.2/1.3) — deja claro el área,
  // sobre todo en touch. A propósito NO son `contentEditable`: permitirlo
  // habilitaba escritura libre de teclado (escribir, borrar, Enter) encima
  // de contenido que ya trae su propia estructura (listas, blockquotes del
  // "Texto oficial"), y el navegador reestructura esos elementos al escribir
  // dentro — feedback directo de Diego, que vio una lista/cita reventar tras
  // escribir en modo edición. La API de Range (`BarraFormato`) manipula el
  // DOM igual de bien sobre un `<div>` normal; `contentEditable` nunca fue
  // necesario para envolver/desenvolver la selección en `<strong>`/`<u>`/
  // `<mark>`, solo añadía la posibilidad — no deseada — de teclear encima.
  const claseAnotable = modoEdicion
    ? " rounded-sm outline outline-1 outline-dashed outline-borde"
    : "";

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 bg-bg-primario sm:mx-0">
        <div role="tablist" aria-label="Secciones del concepto" className="flex gap-1 overflow-x-auto border-b border-borde px-4 sm:px-0">
          {SECCIONES.map((seccion) => (
            <button
              key={seccion.id}
              type="button"
              role="tab"
              id={`pestana-${seccion.id}`}
              aria-selected={seccionActiva === seccion.id}
              aria-controls={seccion.id}
              onClick={() => seleccionarSeccion(seccion.id)}
              className={
                seccionActiva === seccion.id
                  ? "whitespace-nowrap border-b-2 border-texto-primario px-3 py-2.5 text-sm font-medium text-texto-primario"
                  : "whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-texto-secundario hover:text-texto-primario"
              }
            >
              {seccion.etiqueta}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-borde px-4 py-2 sm:px-0">
          <button
            type="button"
            onClick={alternarModoEdicion}
            aria-pressed={modoEdicion}
            className={
              modoEdicion
                ? "rounded-md border border-texto-secundario/40 bg-bg-secundario px-3 py-1.5 text-sm font-medium text-texto-primario"
                : "rounded-md border border-borde px-3 py-1.5 text-sm font-medium text-texto-secundario hover:border-texto-secundario hover:text-texto-primario"
            }
          >
            {modoEdicion ? "Salir de modo edición" : "Modo edición"}
          </button>

          <label className="flex items-center gap-2 text-sm text-texto-secundario">
            <input
              type="checkbox"
              checked={mostrarAnotaciones}
              disabled={modoEdicion}
              onChange={(evento) => setMostrarAnotaciones(evento.target.checked)}
              className="h-4 w-4 rounded border-borde accent-texto-primario disabled:opacity-60"
            />
            Ver material adaptado y resumen con mis anotaciones
          </label>
        </div>

        {modoEdicion && <BarraFormato puedeFormatear={seccionAnotableParaFormato} onFormatear={alFormatear} />}

        <ProgresoLectura />
      </div>

      {(seccionActiva === "texto-oficial" || seccionActiva === "material-oficial-anotado") && (
        <ProgresoLecturaLateral />
      )}

      {avisoContinuar && (
        <p role="status" className="mt-3 px-4 text-sm text-texto-secundario sm:px-0">
          Continuando desde donde lo dejaste.
        </p>
      )}

      <div className="mt-6 space-y-10 px-4 sm:px-0">
        <section
          id="texto-oficial"
          role="tabpanel"
          aria-labelledby="pestana-texto-oficial"
          hidden={seccionActiva !== "texto-oficial"}
          className="medida-lectura-oficial"
        >
          <h2 className="text-lg font-medium">Texto oficial</h2>
          {/* Siempre el original, tal cual — sin ref ni anotación posible
              aquí (ver "Material oficial anotado" más abajo). */}
          <div className="contenido-lectura mt-3">{textoOficial}</div>
          {fuenteNormativa}
        </section>

        <section
          id="material-oficial-anotado"
          role="tabpanel"
          aria-labelledby="pestana-material-oficial-anotado"
          hidden={seccionActiva !== "material-oficial-anotado"}
          className="medida-lectura-oficial rounded-md border border-borde bg-bg-secundario p-4 sm:p-6"
        >
          <h2 className="text-lg font-medium">Material oficial anotado</h2>
          <p className="mt-1 text-sm text-texto-secundario">
            Tu propia copia del texto oficial, con negrita/subrayado/resaltado — el texto
            oficial de arriba no cambia nunca.
          </p>
          <div
            ref={refTextoOficial}
            data-seccion-id="texto-oficial"
            className={`contenido-lectura mt-3${claseAnotable}`}
          >
            {textoOficial}
          </div>
        </section>

        <section
          id="material-adaptado"
          role="tabpanel"
          aria-labelledby="pestana-material-adaptado"
          hidden={seccionActiva !== "material-adaptado"}
          className="medida-lectura"
        >
          <h2 className="text-lg font-medium">Material adaptado</h2>
          <div
            ref={refMaterialAdaptado}
            data-seccion-id="material-adaptado"
            className={`contenido-lectura mt-3${claseAnotable}`}
          >
            {materialAdaptado}
          </div>
        </section>

        <section
          id="resumen"
          role="tabpanel"
          aria-labelledby="pestana-resumen"
          hidden={seccionActiva !== "resumen"}
          className="medida-lectura border-l-4 border-borde pl-4"
        >
          <h2 className="text-lg font-medium">Resumen</h2>
          <div id="esquema" className="mt-4">
            <h3 className="text-base font-medium">Esquema</h3>
            <div
              ref={refEsquema}
              data-seccion-id="esquema"
              className={`contenido-lectura mt-2${claseAnotable}`}
            >
              {esquema}
            </div>
          </div>
          <div id="resumen-extenso" className="mt-6">
            <h3 className="text-base font-medium">Resumen extenso</h3>
            <div
              ref={refResumenExtenso}
              data-seccion-id="resumen-extenso"
              className={`contenido-lectura mt-2${claseAnotable}`}
            >
              {resumenExtenso}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
