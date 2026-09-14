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

const cachePerfiles = new Map<string, PerfilOposicion | null>();

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
