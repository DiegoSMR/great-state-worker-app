import Link from "next/link";
import { notFound } from "next/navigation";
import type { DatoOficial } from "@/lib/dato-oficial";
import { extraerEnlaceFuente } from "@/lib/contenido";
import { esNucleoComun, getOposicion, getTemasDeOposicion } from "@/lib/temario";
import { getPerfilOposicion } from "@/lib/perfil-oposicion";
import { Markdown } from "@/components/estudio/Markdown";
import { DatoPendiente } from "@/components/estudio/DatoPendiente";
import { NucleoComunBadge } from "../../_components/NucleoComunBadge";

/** Fuente + fecha de un DatoOficial confirmado, como nota corta bajo el valor. */
function FuenteInline({ fuente, fechaConsulta }: { fuente: string; fechaConsulta: string }) {
  const enlace = extraerEnlaceFuente(fuente);
  return (
    <span className="mt-0.5 block text-xs text-texto-secundario">
      Fuente:{" "}
      {enlace ? (
        <a
          href={enlace}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 hover:text-texto-primario"
        >
          {fuente}
        </a>
      ) : (
        fuente
      )}{" "}
      ({fechaConsulta})
    </span>
  );
}

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

      {perfil && (
        <div className="mt-8 space-y-8 [&>section]:max-w-[70ch]">
          <section aria-labelledby="requisitos-acceso">
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

          <section aria-labelledby="funciones-puesto">
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
