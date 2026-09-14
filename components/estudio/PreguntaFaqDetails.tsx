import type { PreguntaFaq } from "@/lib/perfil-oposicion";
import { Markdown } from "@/components/estudio/Markdown";
import { DatoPendiente } from "@/components/estudio/DatoPendiente";
import { FuenteInline } from "@/components/estudio/FuenteInline";

/**
 * Una pregunta frecuente como `<details>` nativo, cerrada por defecto — mismo
 * patrón que FuenteNormativa (specs/018-perfil-oposicion/design.md, decisión
 * de disenador-maquetador), reutilizado tanto en la introducción de cada
 * oposición como en /estudio/faqs.
 */
export function PreguntaFaqDetails({ item }: { item: PreguntaFaq }) {
  return (
    <details className="rounded-md border border-borde px-4 py-3">
      <summary className="cursor-pointer select-none font-medium text-texto-primario">
        {item.pregunta}
      </summary>
      <div className="mt-2">
        <Markdown texto={item.respuesta} compacto />
        {item.fuente &&
          (item.fuente.estado === "confirmado" ? (
            <FuenteInline fuente={item.fuente.fuente} fechaConsulta={item.fuente.fechaConsulta} />
          ) : (
            <div className="mt-1">
              <DatoPendiente nota={item.fuente.nota} />
            </div>
          ))}
      </div>
    </details>
  );
}
