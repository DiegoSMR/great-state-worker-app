"use client";

/**
 * Barra de herramientas de anotación (Requisito 1.2,
 * specs/020-anotaciones-personales-lectura) — opera directamente sobre
 * `window.getSelection()`/`Range`, envolviendo la selección actual en
 * `<strong>`/`<u>`/`<mark class="anotacion-resaltado">`, o desenvolviéndola
 * ("Quitar formato"). Sin librería de editor ni `document.execCommand`
 * (design.md: Range API manual da control exacto de qué tag se inserta).
 *
 * `onMouseDown` con `preventDefault()` en cada botón: un click normal
 * primero dispara `mousedown` (que, sobre un elemento fuera del
 * `contentEditable`, colapsaría la selección de texto antes de que llegue
 * a ejecutarse `onClick`) y solo después `click`. Evitar ese `mousedown`
 * por defecto es lo que permite pulsar un botón de la barra sin perder la
 * selección hecha en el contenido — importante especialmente en touch
 * (tablet), donde no hay una alternativa de teclado.
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

function envolverSeleccion(tag: "strong" | "u" | "mark"): void {
  const rango = obtenerRangoValido();
  if (!rango) return;
  const contenido = rango.extractContents();
  const envoltorio = document.createElement(tag);
  if (tag === "mark") envoltorio.className = "anotacion-resaltado";
  envoltorio.appendChild(contenido);
  rango.insertNode(envoltorio);
  colocarCursorTrasNodo(envoltorio);
}

/** ¿Es este elemento uno de los tags de formato de anotación? (no toca `p`/`div`/etc. de estructura). */
function esTagDeFormato(elemento: Element): boolean {
  const tag = elemento.tagName.toLowerCase();
  return tag === "strong" || tag === "u" || (tag === "mark" && elemento.classList.contains("anotacion-resaltado"));
}

function desenvolverEtiquetas(nodo: Node): void {
  if (nodo.nodeType !== Node.ELEMENT_NODE) return;
  const elemento = nodo as Element;
  Array.from(elemento.children).forEach(desenvolverEtiquetas);
  if (esTagDeFormato(elemento) && elemento.parentNode) {
    while (elemento.firstChild) {
      elemento.parentNode.insertBefore(elemento.firstChild, elemento);
    }
    elemento.parentNode.removeChild(elemento);
  }
}

function quitarFormatoSeleccion(): void {
  const rango = obtenerRangoValido();
  if (!rango) return;
  const contenido = rango.extractContents();
  Array.from(contenido.childNodes).forEach(desenvolverEtiquetas);
  rango.insertNode(contenido);
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

const BOTONES: { accion: Accion; etiqueta: string }[] = [
  { accion: "negrita", etiqueta: "Negrita" },
  { accion: "subrayado", etiqueta: "Subrayado" },
  { accion: "resaltado", etiqueta: "Resaltar" },
  { accion: "quitar", etiqueta: "Quitar formato" },
];

export function BarraFormato({ onCambio }: { onCambio: () => void }) {
  return (
    <div
      role="toolbar"
      aria-label="Formato de anotación"
      className="flex flex-wrap gap-2 border-b border-borde bg-bg-secundario px-4 py-2 sm:px-0"
    >
      {BOTONES.map(({ accion, etiqueta }) => (
        <button
          key={accion}
          type="button"
          onMouseDown={(evento) => evento.preventDefault()}
          onClick={() => {
            aplicar(accion);
            onCambio();
          }}
          className="rounded-md border border-borde bg-bg-primario px-3 py-1.5 text-sm font-medium text-texto-secundario hover:border-texto-secundario hover:text-texto-primario"
        >
          {etiqueta}
        </button>
      ))}
    </div>
  );
}
