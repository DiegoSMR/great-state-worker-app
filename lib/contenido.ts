import { existsSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

export type ContenidoConcepto = {
  fuentes: string[];
  textoOficial: string;
  materialAdaptado: string;
  esquema: string;
  resumenExtenso: string;
  /** Marcado por verificador-vigencia-normativa vía `en_revision: true` en el frontmatter (Requisito 6). */
  enRevision: boolean;
};

/**
 * Dominios que en el contenido ya escrito aparecen sin esquema `https://`
 * (p. ej. "boe.es/buscar/..."). Ver specs/003-sistema-de-diseno/design.md,
 * riesgo "extraerEnlaceFuente depende de que el string contenga una URL con
 * esquema" — se tratan como caso especial en vez de bloquear el enlace.
 */
const DOMINIOS_CONOCIDOS_SIN_ESQUEMA = ["boe.es", "boa.aragon.es"];

/** Quita puntuación de cierre que suele venir pegada a la URL dentro de una frase entre paréntesis. */
function limpiarFinal(url: string): string {
  return url.replace(/[),.;]+$/, "");
}

/**
 * Extrae un enlace de una entrada de `fuentes:` si lo hay — tolera tanto
 * URLs completas como dominios conocidos sin esquema. Si no encuentra nada,
 * devuelve null y quien la use debe mostrar el texto plano sin enlace, sin
 * romper el render (Requisito 11).
 */
export function extraerEnlaceFuente(fuente: string): string | null {
  const conEsquema = fuente.match(/https?:\/\/\S+/);
  if (conEsquema) return limpiarFinal(conEsquema[0]);

  for (const dominio of DOMINIOS_CONOCIDOS_SIN_ESQUEMA) {
    const regex = new RegExp(`\\b${escapeRegExp(dominio)}\\S*`, "i");
    const encontrado = fuente.match(regex);
    if (encontrado) return `https://${limpiarFinal(encontrado[0])}`;
  }

  return null;
}

function escapeRegExp(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Extrae el cuerpo de una sección `## Título` o `### Título`, hasta la siguiente cabecera del mismo nivel. */
function extraerBloque(md: string, marcador: "##" | "###", titulo: string): string {
  const regexInicio = new RegExp(`^${marcador}\\s+${escapeRegExp(titulo)}\\s*$`, "m");
  const inicio = md.search(regexInicio);
  if (inicio === -1) return "";

  const desdeTitulo = md.slice(inicio);
  const finPrimeraLinea = desdeTitulo.indexOf("\n");
  const cuerpo = finPrimeraLinea === -1 ? "" : desdeTitulo.slice(finPrimeraLinea + 1);

  const regexSiguiente = new RegExp(`^${marcador}\\s+`, "m");
  const siguiente = cuerpo.search(regexSiguiente);
  return (siguiente === -1 ? cuerpo : cuerpo.slice(0, siguiente)).trim();
}

/**
 * Lee el contenido de un concepto (ver specs/001-seccion-estudio/design.md
 * para el formato). Devuelve null si el concepto todavía no tiene fichero —
 * ese caso se maneja de forma explícita en la UI (Requisito 2, criterio 3),
 * nunca lanzando una excepción sin capturar.
 */
export function getContenidoConcepto(conceptoId: string): ContenidoConcepto | null {
  const filePath = path.join(process.cwd(), "content", "estudio", `${conceptoId}.md`);
  if (!existsSync(filePath)) return null;

  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const resumen = extraerBloque(content, "##", "Resumen");

  return {
    fuentes: Array.isArray(data.fuentes) ? data.fuentes : [],
    textoOficial: extraerBloque(content, "##", "Texto oficial"),
    materialAdaptado: extraerBloque(content, "##", "Material adaptado"),
    esquema: extraerBloque(resumen, "###", "Esquema"),
    resumenExtenso: extraerBloque(resumen, "###", "Resumen extenso"),
    enRevision: data.en_revision === true,
  };
}
