import Link from "next/link";
import { getConceptosEnAlcance } from "@/lib/temario";

export default function CatalogoTemasPage() {
  const conceptos = getConceptosEnAlcance();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/estudio" className="text-sm text-neutral-600 hover:underline">
        ← Estudio
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Catálogo de temas</h1>
      <p className="mt-1 text-neutral-600">
        {conceptos.length} conceptos, sin repetir lo que comparten varias
        oposiciones.
      </p>

      <ul className="mt-8 space-y-2">
        {conceptos.map((concepto) => (
          <li key={concepto.id}>
            <Link
              href={`/estudio/tema/${concepto.id}`}
              className="block rounded-md border border-neutral-200 px-4 py-3 hover:border-neutral-400"
            >
              {concepto.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
