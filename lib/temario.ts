import { readFileSync } from "fs";
import path from "path";
import { parse } from "yaml";

export type Oposicion = {
  id: string;
  nombre: string;
  organismo: string;
  grupo: "administracion" | "informatica";
  subgrupo: string;
  fuente: string;
  nota?: string;
};

export type Concepto = {
  id: string;
  titulo: string;
  grupo: "administracion" | "informatica";
};

export type TemaOficial = {
  op: string;
  num: number;
  concepto: string;
  bloque: string;
  titulo: string;
};

type TemarioData = {
  oposiciones: Oposicion[];
  conceptos: Concepto[];
  temario: TemaOficial[];
};

/**
 * Alcance v1 — ver CONSTITUTION.md, principio 5. SALUD Aragón y el grupo de
 * Informática (TAI, Ejecutivos de Informática DGA) quedan fuera hasta que se
 * decida ampliar el alcance.
 */
export const OPOSICIONES_EN_ALCANCE_V1 = [
  "ayto-zgz-aux-adm",
  "dpz-aux-adm",
  "dga-aux-adm",
  "age-aux-general",
] as const;

let cache: TemarioData | null = null;

function cargarDatos(): TemarioData {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "content", "temario.yaml");
  const raw = readFileSync(filePath, "utf-8");
  cache = parse(raw) as TemarioData;
  return cache;
}

export function getOposicionesEnAlcance(): Oposicion[] {
  const enAlcance = new Set<string>(OPOSICIONES_EN_ALCANCE_V1);
  return cargarDatos().oposiciones.filter((o) => enAlcance.has(o.id));
}

export function getOposicion(oposicionId: string): Oposicion | undefined {
  return cargarDatos().oposiciones.find((o) => o.id === oposicionId);
}

/** Temas oficiales de una oposición, en su numeración oficial. */
export function getTemasDeOposicion(oposicionId: string): TemaOficial[] {
  return cargarDatos()
    .temario.filter((t) => t.op === oposicionId)
    .sort((a, b) => a.num - b.num);
}

/** Catálogo de conceptos sin duplicados, filtrado al alcance v1. */
export function getConceptosEnAlcance(): Concepto[] {
  const oposicionesEnAlcance = new Set(getOposicionesEnAlcance().map((o) => o.id));
  const idsConTema = new Set(
    cargarDatos()
      .temario.filter((t) => oposicionesEnAlcance.has(t.op))
      .map((t) => t.concepto)
  );
  return cargarDatos().conceptos.filter((c) => idsConTema.has(c.id));
}

export function getConcepto(conceptoId: string): Concepto | undefined {
  return cargarDatos().conceptos.find((c) => c.id === conceptoId);
}

/** Todas las filas de relación de un concepto, con la oposición ya resuelta. */
export function getOposicionesDeConcepto(conceptoId: string): {
  oposicion: Oposicion;
  num: number;
  bloque: string;
  tituloOficial: string;
}[] {
  const oposicionesEnAlcance = new Set(getOposicionesEnAlcance().map((o) => o.id));
  return cargarDatos()
    .temario.filter((t) => t.concepto === conceptoId && oposicionesEnAlcance.has(t.op))
    .map((t) => ({
      oposicion: getOposicion(t.op)!,
      num: t.num,
      bloque: t.bloque,
      tituloOficial: t.titulo,
    }));
}

/**
 * Un concepto es "núcleo común" si lo piden 2 o más oposiciones distintas
 * en alcance — calculado, no almacenado (ver design.md de la spec 001).
 */
export function esNucleoComun(conceptoId: string): boolean {
  const oposicionesDistintas = new Set(
    getOposicionesDeConcepto(conceptoId).map((r) => r.oposicion.id)
  );
  return oposicionesDistintas.size >= 2;
}

/**
 * Resumen de núcleo común de una oposición (specs/018-perfil-oposicion,
 * Requisito 3.1): cuántos de sus temas oficiales son núcleo común y con qué
 * otras oposiciones del alcance los comparte, y cuántos conceptos distintos
 * comparte con cada una — derivado por completo de getConceptosEnAlcance()/
 * getOposicionesDeConcepto(), sin fichero de datos nuevo.
 */
export function getResumenNucleoComun(oposicionId: string): {
  totalTemas: number;
  nucleoComun: number;
  compartidoCon: { oposicion: Oposicion; conceptosComunes: number }[];
} {
  const temas = getTemasDeOposicion(oposicionId);
  const conceptosDeLaOposicion = new Set(temas.map((t) => t.concepto));

  let nucleoComun = 0;
  const conteoPorOposicion = new Map<string, number>();

  for (const conceptoId of conceptosDeLaOposicion) {
    const relaciones = getOposicionesDeConcepto(conceptoId);
    const oposicionesDelConcepto = new Set(relaciones.map((r) => r.oposicion.id));
    if (oposicionesDelConcepto.size < 2) continue;

    nucleoComun += 1;
    for (const otraId of oposicionesDelConcepto) {
      if (otraId === oposicionId) continue;
      conteoPorOposicion.set(otraId, (conteoPorOposicion.get(otraId) ?? 0) + 1);
    }
  }

  const compartidoCon = Array.from(conteoPorOposicion.entries())
    .map(([otraId, conceptosComunes]) => ({
      oposicion: getOposicion(otraId)!,
      conceptosComunes,
    }))
    .sort((a, b) => b.conceptosComunes - a.conceptosComunes);

  return { totalTemas: temas.length, nucleoComun, compartidoCon };
}

/**
 * Comparativa de temario completa (specs/018-perfil-oposicion, Requisito
 * 3.2): una fila por concepto en alcance, con la numeración/título oficial
 * que le da cada oposición que lo incluye. Ordenada por nº de oposiciones
 * que comparten el concepto (descendente) y luego alfabéticamente — el
 * núcleo más compartido se lee primero (decisión de disenador-maquetador).
 *
 * `bloque` usa el bloque temático de la primera fila encontrada como
 * etiqueta — simplificación consciente para tener una sola etiqueta por
 * fila (ver "Nota sobre bloque temático" en design.md); el dato original por
 * oposición sigue disponible sin cambios vía getOposicionesDeConcepto().
 */
export function getComparativaTemario(): {
  concepto: Concepto;
  bloque: string;
  porOposicion: Partial<Record<string, { num: number; tituloOficial: string }>>;
}[] {
  return getConceptosEnAlcance()
    .map((concepto) => {
      const relaciones = getOposicionesDeConcepto(concepto.id);
      const porOposicion: Partial<Record<string, { num: number; tituloOficial: string }>> = {};
      for (const r of relaciones) {
        porOposicion[r.oposicion.id] = { num: r.num, tituloOficial: r.tituloOficial };
      }
      return { concepto, bloque: relaciones[0]?.bloque ?? "", porOposicion, _n: relaciones.length };
    })
    .sort((a, b) => b._n - a._n || a.concepto.titulo.localeCompare(b.concepto.titulo, "es"))
    .map(({ concepto, bloque, porOposicion }) => ({ concepto, bloque, porOposicion }));
}
