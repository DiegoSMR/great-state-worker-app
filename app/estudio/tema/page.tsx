import Link from "next/link";
import { esNucleoComun, getConceptosEnAlcance } from "@/lib/temario";
import { NucleoComunBadge } from "../_components/NucleoComunBadge";

export default function CatalogoTemasPage() {
  const conceptos = getConceptosEnAlcance();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">Catálogo de temas</h1>
      <p className="mt-1 text-texto-secundario">
        {conceptos.length} conceptos, sin repetir lo que comparten varias
        oposiciones.
      </p>

      <ul className="mt-8 space-y-2">
        {conceptos.map((concepto) => (
          <li key={concepto.id}>
            <Link
              href={`/estudio/tema/${concepto.id}`}
              className="flex items-center gap-3 rounded-md border border-borde px-4 py-3 text-texto-primario hover:border-texto-secundario"
            >
              <span className="flex-1">{concepto.titulo}</span>
              {esNucleoComun(concepto.id) && <NucleoComunBadge />}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
