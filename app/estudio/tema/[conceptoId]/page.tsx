import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getConcepto, getOposicionesDeConcepto } from "@/lib/temario";
import { getContenidoConcepto } from "@/lib/contenido";

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

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/estudio/tema" className="text-sm text-neutral-600 hover:underline">
        ← Catálogo de temas
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{concepto.titulo}</h1>

      <ul className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-600">
        {oposicionesDelConcepto.map((r) => (
          <li
            key={r.oposicion.id}
            className="rounded-full border border-neutral-200 px-3 py-1"
          >
            {r.oposicion.nombre} ({r.oposicion.organismo}) — tema {r.num}
          </li>
        ))}
      </ul>

      {contenido ? (
        <div className="mt-10 space-y-10">
          <Seccion titulo="Texto oficial" markdown={contenido.textoOficial} />
          {contenido.fuentes.length > 0 && (
            <p className="text-xs text-neutral-500">
              Fuentes: {contenido.fuentes.join("; ")}
            </p>
          )}
          <Seccion titulo="Material adaptado" markdown={contenido.materialAdaptado} />
          <section>
            <h2 className="text-lg font-medium">Resumen</h2>
            <div className="mt-4 space-y-8">
              <Seccion titulo="Esquema" nivel={3} markdown={contenido.esquema} />
              <Seccion titulo="Resumen extenso" nivel={3} markdown={contenido.resumenExtenso} />
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-10 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center">
          <p className="font-medium">Contenido pendiente de redactar</p>
          <p className="mt-1 text-sm text-neutral-600">
            Este tema todavía no tiene material de estudio en la app.
          </p>
        </div>
      )}
    </main>
  );
}

function Seccion({
  titulo,
  markdown,
  nivel = 2,
}: {
  titulo: string;
  markdown: string;
  nivel?: 2 | 3;
}) {
  const Encabezado = nivel === 2 ? "h2" : "h3";
  return (
    <section>
      <Encabezado className={nivel === 2 ? "text-lg font-medium" : "text-base font-medium"}>
        {titulo}
      </Encabezado>
      <div className="prose prose-neutral mt-3 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown || "_(vacío)_"}
        </ReactMarkdown>
      </div>
    </section>
  );
}
