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
