import { existsSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";

export type ContenidoConcepto = {
  fuentes: string[];
  textoOficial: string;
  materialAdaptado: string;
  esquema: string;
  resumenExtenso: string;
};

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
  };
}
