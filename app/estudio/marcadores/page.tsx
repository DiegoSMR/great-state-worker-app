import Link from "next/link";
import { getConcepto } from "@/lib/temario";
import { getBookmarks } from "../actions";
import { BookmarkButton } from "../_components/BookmarkButton";

export default async function MarcadoresPage() {
  const marcadores = await getBookmarks();
  const items = marcadores
    .map((m) => ({ ...m, concepto: getConcepto(m.conceptoId) }))
    .filter((m) => m.concepto !== undefined)
    .sort((a, b) => b.creadoEn.getTime() - a.creadoEn.getTime());

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/estudio" className="text-sm text-neutral-600 hover:underline">
        ← Estudio
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Mis marcadores</h1>

      {items.length === 0 ? (
        <p className="mt-6 text-neutral-600">
          Todavía no has marcado ningún tema. Márcalo desde su página para
          verlo aquí.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {items.map((item) => (
            <li
              key={item.conceptoId}
              className="flex items-center justify-between gap-3 rounded-md border border-neutral-200 px-4 py-3"
            >
              <Link href={`/estudio/tema/${item.conceptoId}`} className="flex-1">
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
