import { existsSync, readFileSync } from "fs";
import path from "path";
import { parse } from "yaml";
import type { Atribucion, DatoOficial } from "@/lib/dato-oficial";

export type RequisitosAcceso = {
  titulacion: DatoOficial<string>;
  edad: DatoOficial<string>;
  nacionalidad: DatoOficial<string>;
  otros: DatoOficial<string>;
};

export type IntroduccionOposicion = {
  /** Denominación oficial completa de cuerpo/escala — NO sustituye a
   * Oposicion.organismo/.subgrupo de content/temario.yaml, que se siguen
   * usando tal cual para identificar la oposición en toda la app. */
  cuerpoEscala: DatoOficial<string>;
  grupoSubgrupo: DatoOficial<string>;
  requisitos: RequisitosAcceso;
  /** Markdown corto (1-3 párrafos) — renderizado con components/estudio/Markdown.tsx. */
  funciones: DatoOficial<string>;
};

export type FilaRetribucion = {
  concepto: string;
  grupo: "base" | "complemento_especifico";
  /** Ejercicio económico al que corresponde la cifra (Requisito 4.3) — no confundir con fechaConsulta. */
  anio: number;
  dato: DatoOficial<string>;
};

export type ConvocatoriaParticipacion = {
  etiqueta: string;
  plazas: DatoOficial<number>;
  aspirantes: DatoOficial<number>;
  // La ratio NUNCA se guarda aquí — ver getRatioParticipacion().
};

export type PreguntaFaq = {
  id: string;
  pregunta: string;
  /** Markdown, renderizado con components/estudio/Markdown.tsx. */
  respuesta: string;
  /** Presente solo si la respuesta depende de un dato oficial concreto (Requisito 2.2). */
  fuente?: Atribucion;
};

export type PerfilOposicion = {
  /** Debe existir en OPOSICIONES_EN_ALCANCE_V1 (lib/temario.ts). */
  oposicionId: string;
  introduccion: IntroduccionOposicion;
  retribuciones: FilaRetribucion[];
  participacion: ConvocatoriaParticipacion[];
  /** Solo las específicas de esta oposición — las comunes viven en faq-comunes.yaml. */
  faqEspecificas: PreguntaFaq[];
};

/** Una pregunta común a varias oposiciones — mismo tipo que PreguntaFaq más el
 * subconjunto de oposiciones al que aplica (normalmente las 4 en alcance). */
export type PreguntaFaqComun = PreguntaFaq & { oposiciones: string[] };

const cachePerfiles = new Map<string, PerfilOposicion | null>();
let cacheFaqComunes: PreguntaFaqComun[] | null = null;

function rutaPerfil(oposicionId: string): string {
  return path.join(process.cwd(), "content", "perfil-oposicion", `${oposicionId}.yaml`);
}

/**
 * Lee el perfil de una oposición (introducción, retribuciones, participación,
 * FAQ específicas). Devuelve null si el fichero todavía no existe — mismo
 * criterio defensivo que getContenidoConcepto en lib/contenido.ts: es
 * razonable que preparador-opos redacte antes unas oposiciones que otras, la
 * página debe seguir funcionando (mostrando solo el listado de temas) si el
 * perfil no existe todavía.
 */
export function getPerfilOposicion(oposicionId: string): PerfilOposicion | null {
  if (cachePerfiles.has(oposicionId)) return cachePerfiles.get(oposicionId)!;

  const filePath = rutaPerfil(oposicionId);
  if (!existsSync(filePath)) {
    cachePerfiles.set(oposicionId, null);
    return null;
  }

  const raw = readFileSync(filePath, "utf-8");
  const perfil = parse(raw) as PerfilOposicion;
  cachePerfiles.set(oposicionId, perfil);
  return perfil;
}

/** FAQ transversales a varias oposiciones (content/perfil-oposicion/faq-comunes.yaml). */
export function getFaqComunes(): PreguntaFaqComun[] {
  if (cacheFaqComunes) return cacheFaqComunes;

  const filePath = path.join(process.cwd(), "content", "perfil-oposicion", "faq-comunes.yaml");
  if (!existsSync(filePath)) {
    cacheFaqComunes = [];
    return cacheFaqComunes;
  }

  const raw = readFileSync(filePath, "utf-8");
  cacheFaqComunes = (parse(raw) as PreguntaFaqComun[]) ?? [];
  return cacheFaqComunes;
}

/** FAQ propias de una oposición — nunca incluye las de getFaqComunes() (Requisito 2.4). */
export function getFaqEspecificas(oposicionId: string): PreguntaFaq[] {
  return getPerfilOposicion(oposicionId)?.faqEspecificas ?? [];
}

/**
 * Ratio aspirantes/plaza de una convocatoria — null si plazas o aspirantes
 * no están `estado: "confirmado"` (Requisito 5.2). Se calcula siempre aquí,
 * nunca se guarda en el YAML, para que no pueda quedar desincronizada de sus
 * dos operandos.
 */
export function getRatioParticipacion(c: ConvocatoriaParticipacion): number | null {
  if (c.plazas.estado !== "confirmado" || c.aspirantes.estado !== "confirmado") return null;
  if (c.plazas.valor === 0) return null;
  return c.aspirantes.valor / c.plazas.valor;
}
