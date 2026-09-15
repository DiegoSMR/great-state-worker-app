"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Oposicion } from "@/lib/temario";

/**
 * Filtro del catálogo de temas (specs/019, Requisito 1). El filtro vive en
 * el query param `oposicion` de la URL, no en estado de cliente ni en la
 * cookie de preferencias `gsw_prefs` — así el botón "atrás" del navegador lo
 * conserva gratis (Requisito 1.4) y no hace falta persistirlo a mano.
 */
export function FiltroOposicion({
  oposiciones,
  seleccionActual,
}: {
  oposiciones: Oposicion[];
  seleccionActual?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const valor = event.target.value;
    router.push(valor ? `${pathname}?oposicion=${valor}` : pathname);
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <label htmlFor="filtro-oposicion" className="text-sm text-texto-secundario">
        Filtrar por oposición
      </label>
      <select
        id="filtro-oposicion"
        value={seleccionActual ?? ""}
        onChange={handleChange}
        className="rounded-md border border-borde bg-bg-primario px-3 py-1.5 text-sm text-texto-primario"
      >
        <option value="">Todas</option>
        {oposiciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
