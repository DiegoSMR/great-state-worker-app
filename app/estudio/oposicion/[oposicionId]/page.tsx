import Link from "next/link";
import { notFound } from "next/navigation";
import { esNucleoComun, getOposicion, getResumenNucleoComun, getTemasDeOposicion } from "@/lib/temario";
import { NucleoComunBadge } from "../../_components/NucleoComunBadge";

export default async function OposicionPage({
  params,
}: {
  params: Promise<{ oposicionId: string }>;
}) {
  const { oposicionId } = await params;
  const oposicion = getOposicion(oposicionId);
  if (!oposicion) notFound();

  const temas = getTemasDeOposicion(oposicionId);
  const resumenNucleoComun = getResumenNucleoComun(oposicionId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">{oposicion.nombre}</h1>
      <p className="mt-1 text-texto-secundario">
        {oposicion.organismo} · {oposicion.subgrupo} · {temas.length} temas
      </p>
      {/* Requisitos/funciones/retribución/participación/FAQs viven en su
          propia ruta, no aquí por delante del temario (petición de Diego:
          lo primero que se quiere ver al entrar en una oposición es su
          temario, no un bloque largo de información administrativa). */}
      <p className="mt-3">
        <Link
          href={`/estudio/oposicion/${oposicionId}/info`}
          className="text-sm text-texto-secundario underline underline-offset-2 hover:text-texto-primario"
        >
          Ver información de la oposición (requisitos, funciones, retribución, plazas...) →
        </Link>
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

      <h2 className="mt-10 text-lg font-medium text-texto-primario">Temario</h2>
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
