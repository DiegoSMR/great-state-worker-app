import { IconoPendiente } from "@/components/nav/iconos";

/**
 * Tag inline para un dato individual (DatoOficial/Atribucion) en
 * `estado: "pendiente_confirmar"` (specs/018-perfil-oposicion/design.md,
 * decisión de disenador-maquetador). Deliberadamente distinto de
 * EstadoPendiente (bloque de página completa) y AvisoRevision (banner de
 * sección): aquí el "pendiente" es el caso esperado para un dato suelto, no
 * una anomalía — nunca lleva color de estado/alerta. `nota` se muestra en
 * texto plano al lado, nunca en un tooltip (el dispositivo principal es
 * tablet táctil).
 */
export function DatoPendiente({ nota }: { nota?: string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 text-sm text-texto-secundario">
      <span className="inline-flex items-center gap-1 rounded border border-dashed border-borde bg-bg-secundario px-1.5 py-0.5">
        <IconoPendiente aria-hidden width="1em" height="1em" />
        Pendiente de confirmar
      </span>
      {nota && <span className="italic">{nota}</span>}
    </span>
  );
}
