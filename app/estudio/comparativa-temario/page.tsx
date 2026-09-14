import Link from "next/link";
import { getComparativaTemario, getOposicionesEnAlcance } from "@/lib/temario";

/**
 * Vista comparativa del temario completo (specs/018-perfil-oposicion,
 * Requisito 3.2) — ruta propia en vez de dentro de cada página de oposición
 * (evita duplicarla 4 veces), sin entrada propia en lib/nav-items.ts
 * (decisión de disenador-maquetador, ver design.md). "–" cuando una
 * oposición no incluye el concepto: es un hecho estructural, no un dato sin
 * verificar, así que nunca usa DatoPendiente.
 */
export default function ComparativaTemarioPage() {
  const oposiciones = getOposicionesEnAlcance();
  const comparativa = getComparativaTemario();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-texto-primario">Comparativa de temario</h1>
      <p className="mt-2 max-w-[70ch] text-texto-secundario">
        Qué concepto es qué tema oficial (y con qué numeración) en cada oposición en alcance. Ordenado por
        cuántas oposiciones comparten cada concepto.
      </p>
      <p className="mt-1 text-sm text-texto-secundario sm:hidden">Desliza la tabla para ver todas las oposiciones →</p>

      <div className="mt-6 overflow-x-auto rounded-md border border-borde">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="sticky top-0 bg-bg-primario">
              <th className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario">
                Concepto
              </th>
              {oposiciones.map((o) => (
                <th
                  key={o.id}
                  className="border-b border-borde px-3 py-2 text-left font-medium text-texto-secundario"
                >
                  {o.nombre}
                  <span className="block text-xs font-normal">{o.organismo}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparativa.map(({ concepto, bloque, porOposicion }) => (
              <tr key={concepto.id} className="border-b border-borde last:border-b-0">
                <td className="px-3 py-2 align-top text-texto-primario">
                  {concepto.titulo}
                  <span className="block text-xs text-texto-secundario">{bloque}</span>
                </td>
                {oposiciones.map((o) => {
                  const rel = porOposicion[o.id];
                  return (
                    <td key={o.id} className="px-3 py-2 align-top">
                      {rel ? (
                        <Link
                          href={`/estudio/tema/${concepto.id}`}
                          title={rel.tituloOficial}
                          className="inline-block rounded-full border border-borde px-2 py-0.5 text-xs text-texto-primario hover:border-texto-secundario"
                        >
                          Tema {rel.num}
                        </Link>
                      ) : (
                        <span aria-label="No incluido en esta oposición" className="text-texto-secundario">
                          –
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
