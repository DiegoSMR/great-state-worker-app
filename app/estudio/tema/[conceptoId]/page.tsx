import { notFound } from "next/navigation";
import { esNucleoComun, getConcepto, getOposicionesDeConcepto } from "@/lib/temario";
import { getContenidoConcepto } from "@/lib/contenido";
import { NucleoComunBadge } from "../../_components/NucleoComunBadge";
import { BookmarkButton } from "../../_components/BookmarkButton";
import { isBookmarked } from "../../actions";
import { Markdown } from "@/components/estudio/Markdown";
import { FuenteNormativa } from "@/components/estudio/FuenteNormativa";
import { AvisoRevision } from "@/components/estudio/AvisoRevision";
import { EstadoPendiente } from "@/components/estudio/EstadoPendiente";
import { SeccionesConcepto } from "@/components/estudio/SeccionesConcepto";
import { OcultarEnConcentracion } from "@/components/estudio/OcultarEnConcentracion";

export default async function ConceptoPage({
  params,
}: {
  params: Promise<{ conceptoId: string }>;
}) {
  const { conceptoId } = await params;
  const concepto = getConcepto(conceptoId);
  if (!concepto) notFound();

  const oposicionesDelConcepto = getOposicionesDeConcepto(conceptoId);
  const contenido = getContenidoConcepto(conceptoId);
  const nucleoComun = esNucleoComun(conceptoId);
  const marcado = await isBookmarked(conceptoId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="flex-1 text-2xl font-semibold text-texto-primario">{concepto.titulo}</h1>
        <OcultarEnConcentracion>{nucleoComun && <NucleoComunBadge />}</OcultarEnConcentracion>
        <BookmarkButton conceptoId={conceptoId} marcado={marcado} />
      </div>
      <OcultarEnConcentracion>
        {nucleoComun && (
          <p className="mt-1 text-sm text-texto-secundario">
            Compartido por {oposicionesDelConcepto.length} oposiciones — rentabiliza
            especialmente bien el tiempo de estudio.
          </p>
        )}

        <ul className="mt-3 flex flex-wrap gap-2 text-sm text-texto-secundario">
          {oposicionesDelConcepto.map((r) => (
            <li key={`${r.oposicion.id}-${r.num}`} className="rounded-full border border-borde px-3 py-1">
              {r.oposicion.nombre} ({r.oposicion.organismo}) — tema {r.num}
            </li>
          ))}
        </ul>
      </OcultarEnConcentracion>

      {contenido?.enRevision && (
        <div className="mt-6">
          <AvisoRevision conFuente={contenido.fuentes.length > 0} />
        </div>
      )}

      {contenido ? (
        <div className="mt-8">
          <SeccionesConcepto
            conceptoId={conceptoId}
            textoOficial={<Markdown texto={contenido.textoOficial} />}
            materialAdaptado={<Markdown texto={contenido.materialAdaptado} />}
            esquema={<Markdown texto={contenido.esquema} compacto />}
            resumenExtenso={<Markdown texto={contenido.resumenExtenso} />}
            fuenteNormativa={
              <FuenteNormativa fuentes={contenido.fuentes} abiertoPorDefecto={contenido.enRevision} />
            }
          />
        </div>
      ) : (
        <EstadoPendiente />
      )}
    </main>
  );
}
