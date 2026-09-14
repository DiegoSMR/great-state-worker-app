import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { DatoOficial } from "@/lib/dato-oficial";
import { extraerEnlaceFuente } from "@/lib/contenido";
import { esNucleoComun, getOposicion, getResumenNucleoComun, getTemasDeOposicion } from "@/lib/temario";
import {
  getFaqEspecificas,
  getPerfilOposicion,
  getRatioParticipacion,
  type FilaRetribucion,
} from "@/lib/perfil-oposicion";
import { Markdown } from "@/components/estudio/Markdown";
import { DatoPendiente } from "@/components/estudio/DatoPendiente";
import { FuenteInline } from "@/components/estudio/FuenteInline";
import { PreguntaFaqDetails } from "@/components/estudio/PreguntaFaqDetails";
import { NucleoComunBadge } from "../../_components/NucleoComunBadge";

/** Campo de un <dl> respaldado por un DatoOficial<string> — valor+fuente si está
 * confirmado, DatoPendiente si no. */
function CampoDato({ etiqueta, dato }: { etiqueta: string; dato: DatoOficial<string> }) {
  return (
    <div>
      <dt className="text-sm font-medium text-texto-secundario">{etiqueta}</dt>
      <dd className="mt-0.5 text-texto-primario">
        {dato.estado === "confirmado" ? (
          <>
            {dato.valor}
            <FuenteInline fuente={dato.fuente} fechaConsulta={dato.fechaConsulta} />
          </>
        ) : (
          <DatoPendiente nota={dato.nota} />
        )}
      </dd>
    </div>
  );
}

const ETIQUETA_GRUPO_RETRIBUCION: Record<FilaRetribucion["grupo"], string> = {
  base: "Retribución base",
  complemento_especifico: "Complemento específico",
};

export default async function OposicionPage({
  params,
}: {
  params: Promise<{ oposicionId: string }>;
}) {
  const { oposicionId } = await params;
  const oposicion = getOposicion(oposicionId);
  if (!oposicion) notFound();

  const temas = getTemasDeOposicion(oposicionId);
  const perfil = getPerfilOposicion(oposicionId);
  const faqs = getFaqEspecificas(oposicionId);
  const resumenNucleoComun = getResumenNucleoComun(oposicionId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">{oposicion.nombre}</h1>
      <p className="mt-1 text-texto-secundario">
        {oposicion.organismo} · {oposicion.subgrupo} · {temas.length} temas
      </p>
      <p className="mt-3">
        <a href="#temario" className="text-sm text-texto-secundario underline underline-offset-2 hover:text-texto-primario">
          Ir directamente al temario ↓
        </a>
      </p>

      <section
        aria-labelledby="nucleo-comun-resumen"
        className="mt-6 max-w-[70ch] rounded-md border border-borde bg-bg-secundario px-4 py-3"
      >
        <p id="nucleo-comun-resumen" className="text-sm text-texto-primario">
          <span className="mr-2 inline-block align-middle">
            <NucleoComunBadge />
          </span>
          {resumenNucleoComun.nucleoComun} de {resumenNucleoComun.totalTemas} temas son núcleo común
          {resumenNucleoComun.compartidoCon.length > 0 && (
            <>
              {" "}
              — compartido con{" "}
              {resumenNucleoComun.compartidoCon
                .map((c) => `${c.oposicion.nombre} (${c.conceptosComunes})`)
                .join(", ")}
            </>
          )}
          .
        </p>
        <Link
          href="/estudio/comparativa-temario"
          className="mt-1.5 inline-block text-sm text-texto-secundario underline underline-offset-2 hover:text-texto-primario"
        >
          Ver comparativa de temario →
        </Link>
      </section>

      {perfil && (
        <div className="mt-8 space-y-8">
          <section aria-labelledby="requisitos-acceso" className="max-w-[70ch]">
            <h2 id="requisitos-acceso" className="text-lg font-medium text-texto-primario">
              Requisitos de acceso
            </h2>
            <dl className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <CampoDato etiqueta="Cuerpo / Escala" dato={perfil.introduccion.cuerpoEscala} />
              <CampoDato etiqueta="Grupo / Subgrupo" dato={perfil.introduccion.grupoSubgrupo} />
              <CampoDato etiqueta="Titulación" dato={perfil.introduccion.requisitos.titulacion} />
              <CampoDato etiqueta="Edad" dato={perfil.introduccion.requisitos.edad} />
              <CampoDato etiqueta="Nacionalidad" dato={perfil.introduccion.requisitos.nacionalidad} />
              <CampoDato etiqueta="Otros requisitos" dato={perfil.introduccion.requisitos.otros} />
            </dl>
          </section>

          <section aria-labelledby="funciones-puesto" className="max-w-[70ch]">
            <h2 id="funciones-puesto" className="text-lg font-medium text-texto-primario">
              Funciones del puesto
            </h2>
            <div className="mt-3">
              {perfil.introduccion.funciones.estado === "confirmado" ? (
                <>
                  <Markdown texto={perfil.introduccion.funciones.valor} compacto />
                  <FuenteInline
                    fuente={perfil.introduccion.funciones.fuente}
                    fechaConsulta={perfil.introduccion.funciones.fechaConsulta}
                  />
                </>
              ) : (
                <DatoPendiente nota={perfil.introduccion.funciones.nota} />
              )}
            </div>
          </section>

          {perfil.retribuciones.length > 0 && (
            <section aria-labelledby="retribucion-puesto">
              <h2 id="retribucion-puesto" className="text-lg font-medium text-texto-primario">
                Retribución del puesto
              </h2>
              <div className="mt-3 overflow-x-auto rounded-md border border-borde">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Concepto
                      </th>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Importe
                      </th>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Año
                      </th>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Fuente
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(["base", "complemento_especifico"] as const).map((grupo) => {
                      const filas = perfil.retribuciones.filter((f) => f.grupo === grupo);
                      if (filas.length === 0) return null;
                      return (
                        <Fragment key={grupo}>
                          <tr>
                            <th
                              colSpan={4}
                              className="border-b border-borde bg-bg-secundario px-3 py-1.5 text-left text-xs font-medium text-texto-secundario"
                            >
                              {ETIQUETA_GRUPO_RETRIBUCION[grupo]}
                            </th>
                          </tr>
                          {filas.map((fila, i) => {
                            const enlace =
                              fila.dato.estado === "confirmado" ? extraerEnlaceFuente(fila.dato.fuente) : null;
                            return (
                              <tr key={`${grupo}-${i}`} className="border-b border-borde last:border-b-0">
                                <td className="px-3 py-2 align-top text-texto-primario">{fila.concepto}</td>
                                <td className="px-3 py-2 align-top text-texto-primario">
                                  {fila.dato.estado === "confirmado" ? (
                                    fila.dato.valor
                                  ) : (
                                    <DatoPendiente nota={fila.dato.nota} />
                                  )}
                                </td>
                                <td className="px-3 py-2 align-top text-texto-primario">{fila.anio}</td>
                                <td className="max-w-[16rem] px-3 py-2 align-top text-texto-secundario">
                                  {fila.dato.estado === "confirmado" ? (
                                    <>
                                      {enlace ? (
                                        <a
                                          href={enlace}
                                          target="_blank"
                                          rel="noreferrer noopener"
                                          title={fila.dato.fuente}
                                          className="underline underline-offset-2 hover:text-texto-primario"
                                        >
                                          {fila.dato.fuente}
                                        </a>
                                      ) : (
                                        fila.dato.fuente
                                      )}
                                      <span className="block text-xs">{fila.dato.fechaConsulta}</span>
                                    </>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {perfil.participacion.length > 0 && (
            <section aria-labelledby="participacion-oposicion">
              <h2 id="participacion-oposicion" className="text-lg font-medium text-texto-primario">
                Plazas y participación
              </h2>
              <div className="mt-3 overflow-x-auto rounded-md border border-borde">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Convocatoria
                      </th>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Plazas
                      </th>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Aspirantes
                      </th>
                      <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                        Ratio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfil.participacion.map((conv, i) => {
                      const ratio = getRatioParticipacion(conv);
                      return (
                        <tr key={i} className="border-b border-borde last:border-b-0">
                          <td className="px-3 py-2 align-top text-texto-primario">{conv.etiqueta}</td>
                          <td className="px-3 py-2 align-top text-texto-primario">
                            {conv.plazas.estado === "confirmado" ? (
                              conv.plazas.valor
                            ) : (
                              <DatoPendiente nota={conv.plazas.nota} />
                            )}
                          </td>
                          <td className="px-3 py-2 align-top text-texto-primario">
                            {conv.aspirantes.estado === "confirmado" ? (
                              conv.aspirantes.valor
                            ) : (
                              <DatoPendiente nota={conv.aspirantes.nota} />
                            )}
                          </td>
                          <td className="px-3 py-2 align-top text-texto-primario">
                            {ratio === null ? (
                              <span aria-label="Ratio no disponible" className="text-texto-secundario">
                                —
                              </span>
                            ) : (
                              `${ratio.toFixed(1)}×`
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {faqs.length > 0 && (
            <section aria-labelledby="faq-oposicion" className="max-w-[70ch]">
              <h2 id="faq-oposicion" className="text-lg font-medium text-texto-primario">
                Preguntas frecuentes
              </h2>
              <div className="mt-3 space-y-2">
                {faqs.map((faq) => (
                  <PreguntaFaqDetails key={faq.id} item={faq} />
                ))}
              </div>
              <p className="mt-3 text-sm text-texto-secundario">
                <Link
                  href="/estudio/faqs#faq-comunes"
                  className="underline underline-offset-2 hover:text-texto-primario"
                >
                  Ver también las preguntas comunes a varias oposiciones →
                </Link>
              </p>
            </section>
          )}
        </div>
      )}

      <h2 id="temario" className="mt-10 scroll-mt-24 text-lg font-medium text-texto-primario">
        Temario
      </h2>
      <ol className="mt-4 space-y-2">
        {temas.map((tema) => (
          <li key={`${tema.op}-${tema.num}`}>
            <Link
              href={`/estudio/tema/${tema.concepto}`}
              className="flex items-baseline gap-3 rounded-md border border-borde px-4 py-3 text-texto-primario hover:border-texto-secundario"
            >
              <span className="shrink-0 text-sm font-medium text-texto-secundario">
                Tema {tema.num}
              </span>
              <span className="flex-1">{tema.titulo}</span>
              {esNucleoComun(tema.concepto) && <NucleoComunBadge />}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
