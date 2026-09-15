import Link from "next/link";
import {
  esNucleoComun,
  getConceptosEnAlcance,
  getOposicionesDeConcepto,
  getOposicionesEnAlcance,
  OPOSICIONES_EN_ALCANCE_V1,
} from "@/lib/temario";
import { NucleoComunBadge } from "../_components/NucleoComunBadge";
import { FiltroOposicion } from "@/components/estudio/FiltroOposicion";

export default async function CatalogoTemasPage({
  searchParams,
}: {
  searchParams: Promise<{ oposicion?: string }>;
}) {
  const { oposicion } = await searchParams;
  // Id inválido o ausente en la URL se trata igual que "todas" — nunca una
  // pantalla rota por un query param manipulado (ver design.md, Riesgos).
  const oposicionSeleccionada = (OPOSICIONES_EN_ALCANCE_V1 as readonly string[]).includes(
    oposicion ?? ""
  )
    ? oposicion
    : undefined;

  const todosLosConceptos = getConceptosEnAlcance();
  const conceptos = oposicionSeleccionada
    ? todosLosConceptos.filter((concepto) =>
        getOposicionesDeConcepto(concepto.id).some((r) => r.oposicion.id === oposicionSeleccionada)
      )
    : todosLosConceptos;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">Catálogo de temas</h1>
      <p className="mt-1 text-texto-secundario">
        {conceptos.length} conceptos, sin repetir lo que comparten varias
        oposiciones.
      </p>

      <FiltroOposicion oposiciones={getOposicionesEnAlcance()} seleccionActual={oposicionSeleccionada} />

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
