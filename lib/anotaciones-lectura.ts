import { defaultSchema } from "rehype-sanitize";

/**
 * Anotaciones personales de lectura (specs/020-anotaciones-personales-lectura)
 * — client-only, `localStorage` por concepto y por sección, mismo patrón
 * que `lib/progreso-lectura.ts` (prefijo de clave propio, lectura/escritura
 * defensiva con `try/catch`: localStorage puede no estar disponible en modo
 * privado o con la cuota agotada, y eso no debe romper la lectura).
 *
 * Distinto del texto enriquecido de autoría (`u`/`mark.ink-*` escrito a mano
 * en content/estudio/*.md, ver Markdown.tsx): esto es una marca privada del
 * dispositivo, nunca contenido compartido ni versionado en git.
 */

const PREFIJO_CLAVE = "gsw_anotaciones:";

export type AnotacionGuardada = {
  html: string;
  hashOriginal: string;
  actualizadoEn: number;
};

function clave(conceptoId: string, seccionId: string): string {
  return `${PREFIJO_CLAVE}${conceptoId}:${seccionId}`;
}

/**
 * Checksum de una pasada (no criptográfico, sin dependencia nueva) sobre el
 * `textContent` plano de una sección — solo necesita detectar que el
 * contenido cambió desde que se guardó la anotación (Requisito 2.3), no ser
 * resistente a colisiones intencionadas.
 */
export function calcularHash(texto: string): string {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (Math.imul(31, hash) + texto.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

/**
 * Lista de tags permitidos para el HTML anotado: el mismo universo que ya
 * permite `esquemaTextoEnriquecido` de Markdown.tsx (elementos normales del
 * contenido de estudio — p, listas, tablas, etc., vía el esquema por
 * defecto de `rehype-sanitize`) más `u` y `mark` (resaltado propio de esta
 * spec, distinto de los `mark.ink-*` de autoría).
 */
const TAGS_PERMITIDOS = new Set<string>([...(defaultSchema.tagNames ?? []), "u", "mark"]);

/**
 * Sanitiza el HTML producido por `contentEditable` antes de guardarlo en
 * `localStorage` y antes de reinyectarlo en el DOM. A diferencia de
 * content/estudio/*.md (que no tiene superficie XSS real porque solo lo
 * escriben nuestros propios agentes), este HTML sí puede arrastrar basura
 * si Diego pega texto copiado de otra web mientras anota (estilos inline,
 * tags ajenos) — allowlist cerrada de tags, y de atributos solo se admite
 * `class="anotacion-resaltado"` en `mark` (el resto de tags no conservan
 * ningún atributo, para que un `style`/`class` pegado no rompa el layout).
 * Un tag no permitido se desenvuelve (se conserva su texto), no se borra.
 */
export function sanitizarHtml(html: string): string {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return "";
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const raiz = doc.body.firstElementChild;
  if (!raiz) return "";
  limpiarNodo(raiz);
  return raiz.innerHTML;
}

function limpiarNodo(nodo: Element): void {
  for (const hijo of Array.from(nodo.childNodes)) {
    if (hijo.nodeType === Node.TEXT_NODE) continue;
    if (hijo.nodeType !== Node.ELEMENT_NODE) {
      nodo.removeChild(hijo);
      continue;
    }
    const elemento = hijo as Element;
    const tag = elemento.tagName.toLowerCase();

    if (tag === "script" || tag === "style") {
      nodo.removeChild(elemento);
      continue;
    }

    // Limpia recursivamente antes de decidir qué hacer con este nodo, para
    // que desenvolver un tag no permitido conserve hijos ya saneados.
    limpiarNodo(elemento);

    if (!TAGS_PERMITIDOS.has(tag)) {
      while (elemento.firstChild) {
        nodo.insertBefore(elemento.firstChild, elemento);
      }
      nodo.removeChild(elemento);
      continue;
    }

    for (const atributo of Array.from(elemento.attributes)) {
      const esClaseResaltado =
        tag === "mark" && atributo.name === "class" && elemento.classList.contains("anotacion-resaltado");
      if (esClaseResaltado) {
        elemento.setAttribute("class", "anotacion-resaltado");
      } else {
        elemento.removeAttribute(atributo.name);
      }
    }
  }
}

export function guardarAnotacion(
  conceptoId: string,
  seccionId: string,
  html: string,
  hashOriginal: string
): void {
  try {
    const valor: AnotacionGuardada = {
      html: sanitizarHtml(html),
      hashOriginal,
      actualizadoEn: Date.now(),
    };
    window.localStorage.setItem(clave(conceptoId, seccionId), JSON.stringify(valor));
  } catch {
    // localStorage puede no estar disponible (modo privado, cuota agotada) —
    // no es motivo para romper la edición, simplemente no se persiste.
  }
}

export function leerAnotacion(conceptoId: string, seccionId: string): AnotacionGuardada | null {
  try {
    const raw = window.localStorage.getItem(clave(conceptoId, seccionId));
    if (!raw) return null;
    const valor = JSON.parse(raw) as Partial<AnotacionGuardada>;
    if (typeof valor.html !== "string" || typeof valor.hashOriginal !== "string") return null;
    return {
      html: sanitizarHtml(valor.html),
      hashOriginal: valor.hashOriginal,
      actualizadoEn: typeof valor.actualizadoEn === "number" ? valor.actualizadoEn : Date.now(),
    };
  } catch {
    return null;
  }
}

export function borrarAnotacion(conceptoId: string, seccionId: string): void {
  try {
    window.localStorage.removeItem(clave(conceptoId, seccionId));
  } catch {
    // Igual que arriba: si localStorage no está disponible, no hay nada que borrar.
  }
}
