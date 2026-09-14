import Link from "next/link";
import { notFound } from "next/navigation";
import { esNucleoComun, getOposicion, getTemasDeOposicion } from "@/lib/temario";
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">{oposicion.nombre}</h1>
      <p className="mt-1 text-texto-secundario">
        {oposicion.organismo} · {oposicion.subgrupo} · {temas.length} temas
      </p>

      <ol className="mt-8 space-y-2">
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
