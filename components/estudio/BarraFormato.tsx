"use client";

import { useEffect, useRef, useState, type ReactElement, type SVGProps } from "react";
import { IconoNegrita, IconoQuitarFormato, IconoResaltar, IconoSubrayado } from "./iconosFormato";

/**
 * Panel de formato de anotación (Requisito 1.2,
 * specs/020-anotaciones-personales-lectura) — opera directamente sobre
 * `window.getSelection()`/`Range`, envolviendo la selección actual en
 * `<strong>`/`<u>`/`<mark class="anotacion-resaltado">`, o desenvolviéndola
 * ("Quitar formato"). Sin librería de editor ni `document.execCommand`
 * (design.md: Range API manual da control exacto de qué tag se inserta).
 *
 * Ni aplicar ni quitar formato usan `Range.extractContents()`/`insertNode()`
 * sobre el fragmento completo: mover contenido a un único punto de inserción
 * rompe la estructura cuando ese punto cae dentro de un tag de formato ya
 * existente (negrita de autoría, p. ej.) o cuando la selección cruza más de
 * un `<p>` (un tag de frase no puede contener bloques sin que el navegador
 * los reestructure al volver a parsear el HTML guardado). En su lugar, cada
 * nodo de texto que interseca la selección se recorta a su porción exacta
 * (`Text.splitText`) y se envuelve/desenvuelve EN SU SITIO, sin mover nada
 * fuera de su padre original — así nunca se cruza un límite de bloque ni se
 * inserta contenido dentro de un tag ajeno a la selección.
 *
 * `onMouseDown` con `preventDefault()` en cada botón: un click normal
 * primero dispara `mousedown` (que, sobre un elemento fuera del
 * `contentEditable`, colapsaría la selección de texto antes de que llegue
 * a ejecutarse `onClick`) y solo después `click`. Evitar ese `mousedown`
 * por defecto es lo que permite pulsar un botón de la barra sin perder la
 * selección hecha en el contenido — importante especialmente en touch
 * (tablet), donde no hay una alternativa de teclado.
 *
 * Extensión (2026-09-17, design.md): el panel deja de vivir en flujo normal
 * como franja sticky y pasa a ser un panel `position: fixed` pegado a la
 * selección de texto ("selection toolbar", patrón Notion/Medium) — ver
 * componente `BarraFormato` más abajo para el cálculo de posición. Nada de
 * la lógica de formato de arriba (líneas ~30-180) cambia en esta extensión.
 */

type Accion = "negrita" | "subrayado" | "resaltado" | "quitar";

function obtenerRangoValido(): Range | null {
  const seleccion = window.getSelection();
  if (!seleccion || seleccion.rangeCount === 0 || seleccion.isCollapsed) return null;
  return seleccion.getRangeAt(0);
}

function colocarCursorTrasNodo(nodo: Node): void {
  const rango = document.createRange();
  rango.setStartAfter(nodo);
  rango.collapse(true);
  const seleccion = window.getSelection();
  seleccion?.removeAllRanges();
  seleccion?.addRange(rango);
}

/** ¿Es este elemento uno de los tags de formato de anotación? (no toca `p`/`div`/etc. de estructura). */
function esTagDeFormato(elemento: Element): boolean {
  const tag = elemento.tagName.toLowerCase();
  return tag === "strong" || tag === "u" || (tag === "mark" && elemento.classList.contains("anotacion-resaltado"));
}

/** Todos los nodos de texto (no vacíos) que intersecan el rango, en orden de documento. */
function nodosTextoEnRango(rango: Range): Text[] {
  const contenedor = rango.commonAncestorContainer;
  const raiz = contenedor.nodeType === Node.ELEMENT_NODE ? contenedor : contenedor.parentNode;
  if (!raiz) return [];
  const nodos: Text[] = [];
  const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode: (nodo) => (rango.intersectsNode(nodo) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  let actual = walker.nextNode();
  while (actual) {
    nodos.push(actual as Text);
    actual = walker.nextNode();
  }
  return nodos;
}

/**
 * Recorta `nodo` a la porción exacta cubierta por `rango` (split en los
 * límites de inicio/fin cuando el nodo es el contenedor de inicio/fin) y
 * devuelve ese fragmento ya aislado como nodo de texto propio — sigue
 * siendo hijo del mismo padre, en la misma posición relativa.
 */
function recortarAlRango(nodo: Text, rango: Range): Text {
  const esInicio = nodo === rango.startContainer;
  const esFin = nodo === rango.endContainer;
  const inicio = esInicio ? rango.startOffset : 0;
  const fin = esFin ? rango.endOffset : nodo.length;
  let objetivo = nodo;
  if (fin < objetivo.length) objetivo.splitText(fin);
  if (inicio > 0) objetivo = objetivo.splitText(inicio);
  return objetivo;
}

function envolverSeleccion(tag: "strong" | "u" | "mark"): void {
  const rango = obtenerRangoValido();
  if (!rango) return;
  const className = tag === "mark" ? "anotacion-resaltado" : undefined;
  const nodos = nodosTextoEnRango(rango);
  let ultimoEnvoltorio: Element | null = null;
  nodos.forEach((nodo) => {
    const objetivo = recortarAlRango(nodo, rango);
    if (objetivo.length === 0 || !objetivo.parentNode) return;
    const padre = objetivo.parentElement;
    if (padre && padre.tagName.toLowerCase() === tag && (tag !== "mark" || padre.classList.contains(className!))) {
      ultimoEnvoltorio = padre;
      return;
    }
    const envoltorio = document.createElement(tag);
    if (className) envoltorio.className = className;
    objetivo.parentNode.insertBefore(envoltorio, objetivo);
    envoltorio.appendChild(objetivo);
    ultimoEnvoltorio = envoltorio;
  });
  if (ultimoEnvoltorio) colocarCursorTrasNodo(ultimoEnvoltorio);
}

/**
 * Saca `nodo` de cualquier cadena de tags de formato que lo envuelvan
 * (`strong`/`u`/`mark.anotacion-resaltado`, anidados o no), subiendo un
 * nivel cada vez: el tag se divide en un clon "antes" y un clon "después"
 * con los hermanos que quedan fuera de la selección (para no perderles el
 * formato a ellos), y `nodo` pasa a ser hijo directo del abuelo, sin
 * envoltorio. Se detiene en el primer ancestro que no sea un tag de
 * formato (un `<p>` o el `div.contenido-lectura`), así que nunca toca
 * estructura de bloque.
 */
function sacarDeFormato(nodo: Node): void {
  let padre = nodo.parentElement;
  while (padre && esTagDeFormato(padre)) {
    const abuelo = padre.parentNode;
    if (!abuelo) break;
    const hijos = Array.from(padre.childNodes);
    const indice = hijos.indexOf(nodo as ChildNode);
    const anteriores = hijos.slice(0, indice);
    const posteriores = hijos.slice(indice + 1);
    if (anteriores.length > 0) {
      const clon = padre.cloneNode(false) as Element;
      anteriores.forEach((hijo) => clon.appendChild(hijo));
      abuelo.insertBefore(clon, padre);
    }
    abuelo.insertBefore(nodo, padre);
    if (posteriores.length > 0) {
      const clon = padre.cloneNode(false) as Element;
      posteriores.forEach((hijo) => clon.appendChild(hijo));
      abuelo.insertBefore(clon, padre);
    }
    abuelo.removeChild(padre);
    padre = nodo.parentElement;
  }
}

function quitarFormatoSeleccion(): void {
  const rango = obtenerRangoValido();
  if (!rango) return;
  const nodos = nodosTextoEnRango(rango);
  nodos.forEach((nodo) => {
    const objetivo = recortarAlRango(nodo, rango);
    if (objetivo.length === 0) return;
    sacarDeFormato(objetivo);
  });
}

function aplicar(accion: Accion): void {
  switch (accion) {
    case "negrita":
      envolverSeleccion("strong");
      break;
    case "subrayado":
      envolverSeleccion("u");
      break;
    case "resaltado":
      envolverSeleccion("mark");
      break;
    case "quitar":
      quitarFormatoSeleccion();
      break;
  }
}

const BOTONES: {
  accion: Accion;
  etiqueta: string;
  Icono: (props: SVGProps<SVGSVGElement>) => ReactElement;
}[] = [
  { accion: "negrita", etiqueta: "Negrita", Icono: IconoNegrita },
  { accion: "subrayado", etiqueta: "Subrayado", Icono: IconoSubrayado },
  { accion: "resaltado", etiqueta: "Resaltar", Icono: IconoResaltar },
  { accion: "quitar", etiqueta: "Quitar formato", Icono: IconoQuitarFormato },
];

/** Posición en viewport (coordenadas `position: fixed`, coherentes con `getBoundingClientRect()`) donde se planta el panel. */
type Posicion = { top: number; left: number };

/** Margen respecto a los bordes del viewport (clamp horizontal) y respecto al borde superior (umbral de volteo). */
const MARGEN_VIEWPORT = 8;
/** Separación entre el panel y la selección, arriba o debajo de ella. */
const SEPARACION_SELECCION = 10;

export function BarraFormato<T>({
  puedeFormatear,
  onFormatear,
}: {
  /** Sección anotable donde cae la selección actual, o `null` si no cae en ninguna (p. ej. el texto oficial limpio) — se comprueba ANTES de tocar el DOM, no después, para que ese texto nunca llegue a mutarse. */
  puedeFormatear: () => T | null;
  onFormatear: (seccionId: T) => void;
}) {
  // `null` = panel oculto (sin selección válida, o selección fuera de zona
  // anotable). El panel sigue montado en el DOM incluso oculto (ver JSX más
  // abajo: se oculta con `visibility`, no con `hidden`/desmontaje) para
  // poder medir su propio ancho/alto con `panelRef` ANTES de mostrarlo por
  // primera vez — sin esa medida no se puede centrar sobre la selección ni
  // saber si voltear arriba/debajo.
  const [posicion, setPosicion] = useState<Posicion | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function recalcular() {
      const rango = obtenerRangoValido();
      if (!rango) {
        setPosicion(null);
        return;
      }
      // Mismo gate que usa el propio botón al pulsar (`puedeFormatear`) —
      // una selección fuera de una sección anotable (p. ej. en "Texto
      // oficial", que no tiene `data-seccion-id`) no debe ni mostrar el
      // panel, no solo rechazar el click.
      if (puedeFormatear() === null) {
        setPosicion(null);
        return;
      }
      const rect = rango.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        // Rango técnicamente no colapsado pero sin caja visible (p. ej. el
        // nodo quedó desconectado del documento tras una mutación) — nada
        // sobre lo que anclar el panel.
        setPosicion(null);
        return;
      }
      const panel = panelRef.current;
      const anchoPanel = panel?.offsetWidth ?? 0;
      const altoPanel = panel?.offsetHeight ?? 0;

      let left = rect.left + rect.width / 2 - anchoPanel / 2;
      left = Math.min(
        Math.max(left, MARGEN_VIEWPORT),
        Math.max(MARGEN_VIEWPORT, window.innerWidth - anchoPanel - MARGEN_VIEWPORT)
      );

      const arriba = rect.top - altoPanel - SEPARACION_SELECCION;
      // Si plantarlo arriba lo sacaría del viewport (o lo dejaría pegado al
      // borde superior, típicamente bajo la franja sticky de pestañas), se
      // voltea a debajo de la selección en su lugar.
      const top = arriba < MARGEN_VIEWPORT ? rect.bottom + SEPARACION_SELECCION : arriba;

      setPosicion({ top, left });
    }

    // `requestAnimationFrame` para no recalcular más de una vez por frame en
    // scroll/resize (que pueden disparar decenas de eventos por segundo) —
    // el panel debe seguir a la selección durante el scroll, nunca
    // ocultarse mientras tanto.
    let frameId: number | null = null;
    function solicitarRecalculo() {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        recalcular();
      });
    }

    document.addEventListener("selectionchange", solicitarRecalculo);
    // `capture: true`: el scroll de un contenedor interno (no solo la
    // ventana) no burbujea de forma nativa, pero sí se puede capturar desde
    // `window` en fase de captura — cubre así cualquier zona con scroll
    // propio, no solo el de la página completa.
    window.addEventListener("scroll", solicitarRecalculo, { passive: true, capture: true });
    window.addEventListener("resize", solicitarRecalculo);

    return () => {
      document.removeEventListener("selectionchange", solicitarRecalculo);
      window.removeEventListener("scroll", solicitarRecalculo, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", solicitarRecalculo);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [puedeFormatear]);

  const oculto = posicion === null;

  return (
    <div
      ref={panelRef}
      role="toolbar"
      aria-label="Formato de anotación"
      aria-hidden={oculto}
      style={{
        position: "fixed",
        top: posicion?.top ?? 0,
        left: posicion?.left ?? 0,
        visibility: oculto ? "hidden" : "visible",
        pointerEvents: oculto ? "none" : "auto",
      }}
      className="z-20 flex gap-1 rounded-lg border border-borde bg-bg-primario p-1 sombra-panel-flotante"
    >
      {BOTONES.map(({ accion, etiqueta, Icono }) => (
        <button
          key={accion}
          type="button"
          aria-label={etiqueta}
          title={etiqueta}
          tabIndex={oculto ? -1 : 0}
          onMouseDown={(evento) => evento.preventDefault()}
          onClick={() => {
            const seccionId = puedeFormatear();
            if (seccionId === null) return;
            aplicar(accion);
            onFormatear(seccionId);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-md text-texto-secundario hover:bg-bg-secundario hover:text-texto-primario"
        >
          <Icono aria-hidden width="1.3em" height="1.3em" />
        </button>
      ))}
    </div>
  );
}
