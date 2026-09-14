import Link from "next/link";
import { getConcepto } from "@/lib/temario";
import { getBookmarks } from "../actions";
import { BookmarkButton } from "../_components/BookmarkButton";

// Refleja el estado de bookmarks del usuario en cada visita — no se genera
// como página estática en build (evita depender de la base de datos durante
// el build y sirve siempre el estado real).
export const dynamic = "force-dynamic";

export default async function MarcadoresPage() {
  const marcadores = await getBookmarks();
  const items = marcadores
    .map((m) => ({ ...m, concepto: getConcepto(m.conceptoId) }))
    .filter((m) => m.concepto !== undefined)
    .sort((a, b) => b.creadoEn.getTime() - a.creadoEn.getTime());

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">Mis marcadores</h1>

      {items.length === 0 ? (
        <p className="mt-6 text-texto-secundario">
          Todavía no has marcado ningún tema. Márcalo desde su página para
          verlo aquí.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {items.map((item) => (
            <li
              key={item.conceptoId}
              className="flex items-center justify-between gap-3 rounded-md border border-borde px-4 py-3"
            >
              <Link href={`/estudio/tema/${item.conceptoId}`} className="flex-1 text-texto-primario">
                {item.concepto!.titulo}
              </Link>
              <BookmarkButton conceptoId={item.conceptoId} marcado={true} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
